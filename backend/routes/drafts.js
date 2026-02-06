const express = require('express');
const { protect } = require('../middleware/auth');
const router = express.Router();
const Claim = require('../models/Claim');
const logger = require('../utils/logger');
const { getLocationFromIP } = require('../middleware/ipTracking');

// Middleware to get session ID
const getSession = (req, res, next) => {
    const sessionId = req.headers['x-session-id'] || req.body.sessionId;
    if (!sessionId) {
        return res.status(400).json({
            success: false,
            error: 'Session ID required'
        });
    }
    req.sessionId = sessionId;
    next();
};

// Auto-save endpoint - saves draft to Draft collection
router.post('/auto-save', getSession, async (req, res) => {
    try {
        const { formData, currentStep } = req.body;
        const sessionId = req.sessionId;
        const Draft = require('../models/Draft');

        // Get IP and location
        const ipAddress = req.realIP || req.ip || '127.0.0.1';
        let location = req.ipLocation;

        // Resolve location if not available
        if (!location || location === 'Resolving...' || location === 'Unknown') {
            try {
                location = await getLocationFromIP(ipAddress);
            } catch (error) {
                location = ipAddress === '127.0.0.1' ? 'Local' : 'Unknown';
            }
        }

        // Save or update draft in Draft collection
        const draft = await Draft.findOneAndUpdate(
            { sessionId },
            {
                formData,
                sessionId,
                currentStep,
                status: 'draft',
                ipAddress,
                location,
                userAgent: req.get('user-agent'),
                lastSaved: new Date()
            },
            {
                upsert: true,
                new: true,
                runValidators: true
            }
        );

        logger.info(`Draft auto-saved for session: ${sessionId.substring(0, 20)}...`);

        res.json({
            success: true,
            message: 'Draft saved',
            sessionId,
            lastSaved: draft.lastSaved,
            completionPercentage: draft.completionPercentage
        });
    } catch (error) {
        logger.error('Failed to save draft:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to save draft'
        });
    }
});

// Get draft endpoint - retrieves from Draft collection
router.get('/get-draft', getSession, async (req, res) => {
    try {
        const sessionId = req.sessionId;
        const Draft = require('../models/Draft');

        const draft = await Draft.findOne({ sessionId });

        if (draft) {
            logger.info(`Draft found for session: ${sessionId.substring(0, 20)}...`);

            res.json({
                success: true,
                draft: {
                    formData: draft.formData,
                    lastSaved: draft.lastSaved,
                    completionPercentage: draft.completionPercentage,
                    currentStep: draft.currentStep
                }
            });
        } else {
            res.json({
                success: false,
                message: 'No draft found'
            });
        }
    } catch (error) {
        logger.error('Failed to fetch draft:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch draft'
        });
    }
});

// Delete draft endpoint
router.delete('/delete-draft', getSession, async (req, res) => {
    try {
        const sessionId = req.sessionId;
        const Draft = require('../models/Draft');

        await Draft.findOneAndDelete({ sessionId });

        logger.info(`Draft deleted for session: ${sessionId.substring(0, 20)}...`);

        res.json({
            success: true,
            message: 'Draft deleted'
        });
    } catch (error) {
        logger.error('Failed to delete draft:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete draft'
        });
    }
});

// Convert draft to submission (Optional, handles legacy call if any)
router.post('/convert', getSession, async (req, res) => {
    try {
        const sessionId = req.sessionId;

        const draft = await Claim.findOne({ sessionId, isDraft: true });

        if (!draft) {
            return res.status(404).json({
                success: false,
                error: 'No draft found to convert'
            });
        }

        // Mark as converted
        draft.isDraft = false;
        draft.status = 'new';
        await draft.save();

        logger.info(`Draft converted for session: ${sessionId.substring(0, 20)}...`);

        res.json({
            success: true,
            message: 'Draft converted to submission',
            data: draft
        });
    } catch (error) {
        logger.error('Failed to convert draft:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to convert draft'
        });
    }
});

// Get draft statistics (admin endpoint)
router.get('/stats', protect, async (req, res) => {
    try {
        const metrics = await Claim.getMetrics();
        res.json({
            success: true,
            stats: {
                total: metrics.drafts,
                today: 0 // Could be added to metrics if needed
            }
        });
    } catch (error) {
        logger.error('Failed to get draft stats:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get draft statistics'
        });
    }
});

// List all drafts (admin endpoint)
router.get('/list', protect, async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;

        const drafts = await Claim.find({ isDraft: true })
            .sort({ updatedAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .select('sessionId firstName lastName email phone currentStep completionPercentage ipAddress location updatedAt createdAt');

        const total = await Claim.countDocuments({ isDraft: true });

        res.json({
            success: true,
            drafts,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        logger.error('Failed to list drafts:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to list drafts'
        });
    }
});

// Delete draft by ID (admin endpoint)
router.delete('/:id', protect, async (req, res) => {
    try {
        const Draft = require('../models/Draft');
        const draft = await Draft.findByIdAndDelete(req.params.id);

        if (!draft) {
            return res.status(404).json({
                success: false,
                error: 'Draft not found'
            });
        }

        logger.info(`Draft deleted by admin: ${draft._id}`);

        res.json({
            success: true,
            message: 'Draft deleted successfully'
        });
    } catch (error) {
        logger.error('Failed to delete draft:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete draft'
        });
    }
});

// Export drafts as CSV (admin endpoint)
router.get('/export', protect, async (req, res) => {
    try {
        const Draft = require('../models/Draft');
        const drafts = await Draft.find()
            .sort({ lastSaved: -1 })
            .select('-__v');

        // Create CSV header - ALL form fields
        const headers = [
            'Session ID',
            // Section 1: Personal Details
            'Title',
            'First Name',
            'Last Name',
            'Email',
            'Phone',
            'Date of Birth',
            // Section 2: Address
            'Address Line 1',
            'Address Line 2',
            'City',
            'County',
            'Postcode',
            'Has Previous Address',
            'Prev Address Line 1',
            'Prev City',
            'Prev Postcode',
            // Section 3: Claim/Finance Details
            'Had Car Finance',
            'Finance Type',
            'Finance Period',
            'Finance Period Start',
            'Finance Period End',
            'Commission Disclosed',
            // Section 4: Consent
            'Terms Accepted',
            'Privacy Accepted',
            'Marketing Opt-In',
            'Has Signature',
            // Metadata
            'Location',
            'Completion %',
            'Status',
            'Last Saved',
            'Created At'
        ];

        // Create CSV rows - handle flat formData structure
        const rows = drafts.map(draft => {
            const fd = draft.formData || {};
            return [
                draft.sessionId || '',
                // Section 1: Personal Details
                fd.title || '',
                fd.firstName || fd.personalDetails?.firstName || '',
                fd.lastName || fd.personalDetails?.lastName || '',
                fd.email || fd.personalDetails?.email || '',
                fd.phone || fd.personalDetails?.phone || '',
                fd.dob || fd.dateOfBirth || '',
                // Section 2: Address
                fd.addressLine1 || '',
                fd.addressLine2 || '',
                fd.city || '',
                fd.county || '',
                fd.postcode || '',
                fd.hasPreviousAddress ? 'Yes' : 'No',
                fd.prevAddressLine1 || '',
                fd.prevCity || '',
                fd.prevPostcode || '',
                // Section 3: Claim/Finance Details
                fd.hadCarFinance ? 'Yes' : 'No',
                fd.financeType || '',
                fd.financePeriod || '',
                fd.financePeriodStart || '',
                fd.financePeriodEnd || '',
                fd.wasCommissionDisclosed || '',
                // Section 4: Consent
                fd.termsAccepted ? 'Yes' : 'No',
                fd.privacyAccepted ? 'Yes' : 'No',
                fd.marketingOptIn ? 'Yes' : 'No',
                fd.signature ? 'Yes' : 'No',
                // Metadata
                draft.location || '',
                draft.completionPercentage || 0,
                draft.status || 'draft',
                draft.lastSaved ? new Date(draft.lastSaved).toISOString() : '',
                draft.createdAt ? new Date(draft.createdAt).toISOString() : ''
            ];
        });

        // Build CSV string
        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
        ].join('\n');

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=drafts-export-${Date.now()}.csv`);
        res.send(csvContent);

        logger.info(`Exported ${drafts.length} drafts to CSV`);
    } catch (error) {
        logger.error('Failed to export drafts:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to export drafts'
        });
    }
});

module.exports = router;
