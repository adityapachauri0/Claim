const axios = require('axios');
const logger = require('../utils/logger');

const R2R_API_URL = process.env.R2R_API_URL || 'https://r2r.theclaimsystem.co.uk/api/v1/affiliate';
const R2R_AFFILIATE_ID = process.env.R2R_AFFILIATE_ID;
const R2R_API_KEY = process.env.R2R_API_KEY;

/**
 * Forward a claim to the R2R Affiliate Submission API
 * @param {Object} claim - The Mongoose claim document
 * @returns {Object} - { status, response }
 */
const forwardToR2R = async (claim) => {
    if (!R2R_AFFILIATE_ID || !R2R_API_KEY) {
        logger.warn('R2R API credentials not configured. Skipping R2R submission.');
        return { status: 'not_configured', response: null };
    }

    try {
        // Map claim data to R2R API format
        const payload = {
            first_name: claim.firstName,
            last_name: claim.lastName,
            date_of_birth: formatDateForR2R(claim.dateOfBirth || claim.dob),
            phone: claim.phone,
            email: claim.email,
            client_ip: claim.ipAddress || '0.0.0.0',
            user_agent: claim.userAgent || 'Mozilla/5.0',
            session_id: claim.sessionId || 'session_unknown',
            signature: claim.signature || '',
            address: {
                line1: claim.addressLine1 || null,
                line2: claim.addressLine2 || null,
                line3: null,
                line4: null,
                buildingName: null,
                buildingNumber: extractBuildingNumber(claim.addressLine1),
                thoroughfare: extractThoroughfare(claim.addressLine1),
                townOrCity: claim.city || '',
                district: claim.county || null,
                postcode: claim.postcode || ''
            }
        };

        logger.info(`Forwarding claim ${claim.referenceNumber} to R2R API...`);

        const response = await axios.post(
            `${R2R_API_URL}/${R2R_AFFILIATE_ID}`,
            payload,
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'API-KEY': R2R_API_KEY
                },
                timeout: 30000 // 30 second timeout
            }
        );

        const result = response.data;
        logger.info(`R2R API response for ${claim.referenceNumber}: ${JSON.stringify(result)}`);

        // Determine status from response
        let r2rStatus = 'failed';
        if (result.message === 'SUCCESS') {
            r2rStatus = 'success';
        } else if (result.message === 'NO_STREAM') {
            r2rStatus = 'no_stream';
        } else if (result.status === 'authentication-required') {
            r2rStatus = 'auth_required';
        }

        // Update claim with R2R status
        const Claim = require('../models/Claim');
        await Claim.findByIdAndUpdate(claim._id, {
            r2rStatus: r2rStatus,
            r2rResponse: result,
            r2rSubmittedAt: new Date(),
            ...(result.challenge_id ? { r2rChallengeId: result.challenge_id } : {})
        });

        logger.info(`Claim ${claim.referenceNumber} R2R status updated to: ${r2rStatus}`);
        return { status: r2rStatus, response: result };

    } catch (error) {
        logger.error(`R2R API error for claim ${claim.referenceNumber}:`, error.message);
        
        // Update claim with failed status
        try {
            const Claim = require('../models/Claim');
            await Claim.findByIdAndUpdate(claim._id, {
                r2rStatus: 'failed',
                r2rResponse: { error: error.message },
                r2rSubmittedAt: new Date()
            });
        } catch (updateErr) {
            logger.error('Failed to update claim R2R status:', updateErr.message);
        }

        return { status: 'failed', response: { error: error.message } };
    }
};

/**
 * Verify OTP for R2R authentication-required flow
 * @param {string} challengeId - The challenge_id from R2R
 * @param {string} otpCode - The OTP code entered by the user
 * @returns {Object} - { status, response }
 */
const verifyOTP = async (challengeId, otpCode) => {
    if (!R2R_AFFILIATE_ID || !R2R_API_KEY) {
        return { status: 'not_configured', response: null };
    }

    try {
        const response = await axios.post(
            `${R2R_API_URL}/${R2R_AFFILIATE_ID}/otp`,
            {
                challenge_id: challengeId,
                otp_code: otpCode
            },
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'API-KEY': R2R_API_KEY
                },
                timeout: 30000
            }
        );

        const result = response.data;
        logger.info(`R2R OTP verification result: ${JSON.stringify(result)}`);

        let status = 'failed';
        if (result.message === 'SUCCESS') {
            status = 'success';
        } else if (result.message === 'NO_STREAM') {
            status = 'no_stream';
        }

        return { status, response: result };
    } catch (error) {
        logger.error('R2R OTP verification error:', error.message);
        return { status: 'failed', response: { error: error.message } };
    }
};

// Helper: Format date to YYYY-MM-DD
const formatDateForR2R = (dateStr) => {
    if (!dateStr) return '';
    try {
        const date = new Date(dateStr);
        return date.toISOString().split('T')[0];
    } catch {
        return dateStr;
    }
};

// Helper: Extract building number from address line
const extractBuildingNumber = (addressLine) => {
    if (!addressLine) return null;
    const match = addressLine.match(/^(\d+\w?)\s/);
    return match ? match[1] : null;
};

// Helper: Extract street name from address line
const extractThoroughfare = (addressLine) => {
    if (!addressLine) return '';
    return addressLine.replace(/^\d+\w?\s+/, '');
};

module.exports = { forwardToR2R, verifyOTP };
