const express = require('express');
const router = express.Router();
const claimController = require('../controllers/claimController');
const { claimValidationRules, validate, submissionRateLimit } = require('../middleware/validation');
const { protect } = require('../middleware/auth');

// Public routes

// Submit a new claim (with rate limiting)
router.post(
    '/',
    submissionRateLimit,
    claimValidationRules,
    validate,
    claimController.submitClaim
);

// Get claim by reference number (public status check)
router.get('/reference/:reference', claimController.getClaimByReference);

// Admin routes (Protected)

// Export all claims - MUST be before /:id route
router.get('/export/all', protect, claimController.exportClaims);

// Get claim statistics
router.get('/stats', protect, claimController.getClaimStats);

// Get all claims
router.get('/', protect, claimController.getAllClaims);

// Get single claim - MUST be after specific routes like /export/all and /stats
router.get('/:id', protect, claimController.getClaimById);

// Update claim status
router.patch('/:id/status', protect, claimController.updateClaimStatus);
router.put('/:id/status', protect, claimController.updateClaimStatus);

// Delete claim
router.delete('/:id', protect, claimController.deleteClaim);

module.exports = router;
