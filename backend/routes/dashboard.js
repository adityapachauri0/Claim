const express = require('express');
const router = express.Router();
const Claim = require('../models/Claim');
const Draft = require('../models/Draft');
const { protect } = require('../middleware/auth');
const logger = require('../utils/logger');

// @route   GET /api/dashboard/metrics
// @desc    Get dashboard summary metrics
// @access  Protected (Admin)
router.get('/metrics', protect, async (req, res) => {
    try {
        const claimMetrics = await Claim.getMetrics();
        const draftStats = await Draft.getStats();

        res.json({
            success: true,
            data: {
                totalClaims: claimMetrics.total,
                claimsToday: claimMetrics.recentSubmissions,
                totalDrafts: draftStats.total,
                draftsToday: draftStats.today,
                conversionRate: claimMetrics.total > 0
                    ? ((claimMetrics.total / (claimMetrics.total + draftStats.total)) * 100).toFixed(1)
                    : 0,
                statusDistribution: {
                    new: claimMetrics.new,
                    processing: claimMetrics.processing,
                    approved: claimMetrics.approved,
                    completed: claimMetrics.completed
                },
                averageDraftCompletion: draftStats.averageCompletion
            }
        });
    } catch (error) {
        logger.error('Dashboard metrics error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch dashboard metrics'
        });
    }
});

// @route   GET /api/dashboard/recent
// @desc    Get recent submissions and active drafts
// @access  Protected (Admin)
router.get('/recent', protect, async (req, res) => {
    try {
        const { limit = 10 } = req.query;

        const [recentClaims, recentDrafts] = await Promise.all([
            Claim.find({ isDraft: { $ne: true } })
                .sort({ createdAt: -1 })
                .limit(parseInt(limit))
                .select('referenceNumber firstName lastName email status createdAt completionPercentage'),
            Draft.find()
                .sort({ lastSaved: -1 })
                .limit(parseInt(limit))
                .select('sessionId formData lastSaved completionPercentage location currentStep')
        ]);

        // Transform drafts for easier consumption
        // Handle both flat structure (from current ClaimForm) and nested structure (legacy)
        const formattedDrafts = recentDrafts.map(draft => ({
            _id: draft._id,
            sessionId: draft.sessionId,
            // Check flat structure first (current form), then nested (legacy), then default
            firstName: draft.formData?.firstName || draft.formData?.personalDetails?.firstName || 'Anonymous',
            lastName: draft.formData?.lastName || draft.formData?.personalDetails?.lastName || '',
            email: draft.formData?.email || draft.formData?.personalDetails?.email || '',
            phone: draft.formData?.phone || draft.formData?.personalDetails?.phone || '',
            location: draft.location,
            completionPercentage: draft.completionPercentage,
            lastSaved: draft.lastSaved,
            currentStep: draft.currentStep,
            status: 'drafting'
        }));

        res.json({
            success: true,
            data: {
                claims: recentClaims,
                drafts: formattedDrafts
            }
        });
    } catch (error) {
        logger.error('Dashboard recent activity error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch recent activity'
        });
    }
});

module.exports = router;
