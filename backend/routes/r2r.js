const express = require('express');
const router = express.Router();
const { verifyOTP } = require('../services/r2rService');
const Claim = require('../models/Claim');
const logger = require('../utils/logger');

// @route   POST /api/r2r/verify-otp
// @desc    Verify OTP for R2R authentication-required flow
// @access  Public
router.post('/verify-otp', async (req, res) => {
    try {
        const { challenge_id, otp_code, claimId } = req.body;

        if (!challenge_id || !otp_code) {
            return res.status(400).json({
                success: false,
                message: 'challenge_id and otp_code are required'
            });
        }

        const result = await verifyOTP(challenge_id, otp_code);

        // Update claim status if claimId provided
        if (claimId) {
            await Claim.findByIdAndUpdate(claimId, {
                r2rStatus: result.status,
                r2rResponse: result.response
            });
        }

        res.json({
            success: result.status === 'success',
            status: result.status,
            message: result.status === 'success' ? 'Verification successful' : 'Verification failed'
        });
    } catch (error) {
        logger.error('OTP verification route error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to verify OTP'
        });
    }
});

module.exports = router;
