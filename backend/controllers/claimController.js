const Claim = require('../models/Claim');
const nodemailer = require('nodemailer');
const logger = require('../utils/logger');
const { getLocationFromIP } = require('../middleware/ipTracking');
const { exportToDesktop } = require('../utils/desktopExport');

// Email transporter configuration
const createTransporter = () => {
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
        return nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: process.env.SMTP_PORT || 587,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });
    }
    return null;
};

// Send confirmation email
const sendConfirmationEmail = async (claim) => {
    const transporter = createTransporter();
    if (!transporter) {
        logger.info('Email not configured, skipping confirmation email');
        return;
    }

    const mailOptions = {
        from: process.env.EMAIL_FROM || 'noreply@pcpclaimtoday.co.uk',
        to: claim.email,
        subject: 'Your Claim Has Been Submitted - PCP Claim Today',
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #1a1f35 0%, #2d3555 100%); padding: 30px; text-align: center;">
          <h1 style="color: #00d4aa; margin: 0;">PCP Claim Today</h1>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #1a1f35;">Thank You, ${claim.firstName}!</h2>
          <p style="color: #333; line-height: 1.6;">
            Your claim has been successfully submitted. Our team will review your details and be in touch within 24-48 hours.
          </p>
          <div style="background: white; border-radius: 10px; padding: 20px; margin: 20px 0;">
            <h3 style="color: #1a1f35; margin-top: 0;">What Happens Next?</h3>
            <ol style="color: #555; line-height: 1.8;">
              <li>Our team will review your submission</li>
              <li>We'll search for your eligible finance agreements</li>
              <li>If eligible, we'll submit your claim on your behalf</li>
              <li>You'll only pay if your claim is successful</li>
            </ol>
          </div>
          <p style="color: #333;">
            <strong>Reference Number:</strong> ${claim.referenceNumber || claim._id}
          </p>
          <p style="color: #888; font-size: 12px;">
            If you have any questions, please contact us at support@pcpclaimtoday.co.uk
          </p>
        </div>
        <div style="background: #1a1f35; padding: 20px; text-align: center;">
          <p style="color: #888; font-size: 12px; margin: 0;">
            © 2026 PCP Claim Today. All rights reserved.
          </p>
        </div>
      </div>
    `
    };

    try {
        await transporter.sendMail(mailOptions);
        logger.info('Confirmation email sent to:', claim.email);
    } catch (error) {
        logger.error('Error sending confirmation email:', error);
    }
};

// Submit a new claim
exports.submitClaim = async (req, res) => {
    try {
        const { sessionId, ...formData } = req.body;
        const Draft = require('../models/Draft');

        // Get IP and location
        const ipAddress = req.realIP || req.ip || '127.0.0.1';
        let location = req.ipLocation;

        if (!location || location === 'Resolving...') {
            try {
                location = await getLocationFromIP(ipAddress);
            } catch (error) {
                location = 'Unknown';
            }
        }

        // Check for duplicate submission
        if (sessionId) {
            const existingClaim = await Claim.findOne({ sessionId });
            if (existingClaim) {
                logger.warn('Duplicate submission blocked:', existingClaim.referenceNumber);
                return res.status(200).json({
                    success: true,
                    message: 'Your claim has already been submitted.',
                    data: {
                        id: existingClaim._id,
                        referenceNumber: existingClaim.referenceNumber,
                        status: existingClaim.status,
                        submittedAt: existingClaim.createdAt
                    }
                });
            }
        }

        // Create new claim
        const claim = new Claim({
            ...formData,
            sessionId,
            ipAddress,
            location,
            userAgent: req.get('User-Agent'),
            referrer: req.get('Referrer') || req.get('Referer'),
            source: 'website'
        });

        await claim.save();
        logger.info('New claim created:', claim.referenceNumber);

        // Cleanup: Delete draft if it exists
        if (sessionId) {
            try {
                const deletedDraft = await Draft.findOneAndDelete({ sessionId });
                if (deletedDraft) {
                    logger.info(`Cleaned up draft for session: ${sessionId}`);
                }
            } catch (cleanupError) {
                logger.error('Draft cleanup failed (non-fatal):', cleanupError);
            }
        }

        // Export to Desktop (async)
        exportToDesktop(claim.toObject()).catch(err => {
            logger.error('Background desktop export failed:', err);
        });

        // Send confirmation email (async)
        sendConfirmationEmail(claim);

        res.status(201).json({
            success: true,
            message: 'Claim submitted successfully',
            data: {
                id: claim._id,
                referenceNumber: claim.referenceNumber,
                status: claim.status,
                submittedAt: claim.createdAt
            }
        });
    } catch (error) {
        logger.error('Error submitting claim:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to submit claim. Please try again.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get all claims (admin)
exports.getAllClaims = async (req, res) => {
    try {
        const { status, page = 1, limit = 20, sort = '-createdAt', includeDrafts = false } = req.query;

        const query = {};
        if (status) {
            query.status = status;
        }
        if (!includeDrafts || includeDrafts === 'false') {
            query.isDraft = { $ne: true };
        }

        const skip = (page - 1) * limit;

        const [claims, total] = await Promise.all([
            Claim.find(query)
                .sort(sort)
                .skip(skip)
                .limit(parseInt(limit))
                .select('-signature -userAgent'),
            Claim.countDocuments(query)
        ]);

        res.json({
            success: true,
            data: claims,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        logger.error('Error fetching claims:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch claims'
        });
    }
};

// Get single claim by ID (admin)
exports.getClaimById = async (req, res) => {
    try {
        const claim = await Claim.findById(req.params.id);

        if (!claim) {
            return res.status(404).json({
                success: false,
                message: 'Claim not found'
            });
        }

        res.json({
            success: true,
            data: claim
        });
    } catch (error) {
        logger.error('Error fetching claim:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch claim'
        });
    }
};

// Update claim status (admin)
exports.updateClaimStatus = async (req, res) => {
    try {
        const { status, note } = req.body;

        const validStatuses = ['draft', 'new', 'reviewing', 'processing', 'submitted', 'approved', 'rejected', 'completed'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status'
            });
        }

        const updateData = { status };

        // Add admin note if provided
        if (note) {
            updateData.$push = {
                adminNotes: {
                    note,
                    createdBy: req.body.adminUser || 'admin',
                    createdAt: new Date()
                }
            };
        }

        const claim = await Claim.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        if (!claim) {
            return res.status(404).json({
                success: false,
                message: 'Claim not found'
            });
        }

        res.json({
            success: true,
            message: 'Claim status updated',
            data: claim
        });
    } catch (error) {
        logger.error('Error updating claim:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update claim'
        });
    }
};

// Get claim statistics (admin dashboard)
exports.getClaimStats = async (req, res) => {
    try {
        const metrics = await Claim.getMetrics();

        const todayClaims = await Claim.countDocuments({
            createdAt: { $gte: new Date().setHours(0, 0, 0, 0) },
            isDraft: false
        });

        res.json({
            success: true,
            data: {
                claims: metrics,
                today: todayClaims
            }
        });
    } catch (error) {
        logger.error('Error fetching stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch statistics'
        });
    }
};

// Get claim by reference number (public)
exports.getClaimByReference = async (req, res) => {
    try {
        const { reference } = req.params;

        const claim = await Claim.findOne({ referenceNumber: reference })
            .select('referenceNumber status createdAt firstName');

        if (!claim) {
            return res.status(404).json({
                success: false,
                message: 'Claim not found'
            });
        }

        res.json({
            success: true,
            data: {
                reference: claim.referenceNumber,
                status: claim.status,
                submittedAt: claim.createdAt,
                firstName: claim.firstName
            }
        });
    } catch (error) {
        logger.error('Error fetching claim by reference:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch claim'
        });
    }
};

// Export claims as CSV (admin)
exports.exportClaims = async (req, res) => {
    try {
        const claims = await Claim.find({ isDraft: { $ne: true } })
            .sort('-createdAt')
            .select('-signature -userAgent -__v');

        // Create CSV header
        const headers = [
            'Reference Number',
            'First Name',
            'Last Name',
            'Email',
            'Phone',
            'City',
            'Status',
            'Created At'
        ];

        // Create CSV rows
        const rows = claims.map(claim => [
            claim.referenceNumber || '',
            claim.firstName || '',
            claim.lastName || '',
            claim.email || '',
            claim.phone || '',
            claim.city || '',
            claim.status || '',
            claim.createdAt ? new Date(claim.createdAt).toISOString() : ''
        ]);

        // Build CSV string
        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
        ].join('\n');

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=claims-export-${Date.now()}.csv`);
        res.send(csvContent);
    } catch (error) {
        logger.error('Error exporting claims:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to export claims'
        });
    }
};

// Delete claim (admin)
exports.deleteClaim = async (req, res) => {
    try {
        const claim = await Claim.findByIdAndDelete(req.params.id);

        if (!claim) {
            return res.status(404).json({
                success: false,
                message: 'Claim not found'
            });
        }

        logger.info('Claim deleted:', claim.referenceNumber);

        res.json({
            success: true,
            message: 'Claim deleted successfully',
            data: {
                id: claim._id,
                referenceNumber: claim.referenceNumber
            }
        });
    } catch (error) {
        logger.error('Error deleting claim:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete claim'
        });
    }
};
