const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const EmailValidator = require('../utils/emailValidator');

// Claim submission validation rules
const claimValidationRules = [
    // Personal Details
    body('title')
        .optional()
        .trim()
        .isIn(['Mr', 'Mrs', 'Miss', 'Ms', 'Dr', 'Other'])
        .withMessage('Please select a valid title'),

    body('firstName')
        .trim()
        .notEmpty()
        .withMessage('First name is required')
        .isLength({ min: 2, max: 50 })
        .withMessage('First name must be between 2 and 50 characters')
        .matches(/^[a-zA-Z\s'-]+$/)
        .withMessage('First name must contain only letters, spaces, hyphens, and apostrophes'),

    body('lastName')
        .trim()
        .notEmpty()
        .withMessage('Last name is required')
        .isLength({ min: 2, max: 50 })
        .withMessage('Last name must be between 2 and 50 characters')
        .matches(/^[a-zA-Z\s'-]+$/)
        .withMessage('Last name must contain only letters, spaces, hyphens, and apostrophes'),

    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email address is required')
        .custom((value) => {
            const result = EmailValidator.validate(value);
            if (!result.isValid) {
                throw new Error(result.error || 'Please enter a valid email address');
            }
            return true;
        }),

    body('phone')
        .trim()
        .notEmpty()
        .withMessage('Phone number is required')
        .custom((value) => {
            const digitsOnly = value.replace(/\D/g, '');
            if (digitsOnly.length < 10) {
                throw new Error('Phone number must be at least 10 digits');
            }
            if (digitsOnly.length > 11) {
                throw new Error('Phone number must not exceed 11 digits');
            }
            return true;
        }),

    body('dateOfBirth')
        .notEmpty()
        .withMessage('Date of birth is required')
        .isISO8601()
        .withMessage('Please enter a valid date')
        .custom((value) => {
            const dob = new Date(value);
            const today = new Date();
            const age = Math.floor((today - dob) / (365.25 * 24 * 60 * 60 * 1000));
            if (age < 18) {
                throw new Error('You must be at least 18 years old');
            }
            if (age > 120) {
                throw new Error('Please enter a valid date of birth');
            }
            return true;
        }),

    // Address validation
    body('addressLine1')
        .trim()
        .notEmpty()
        .withMessage('Address line 1 is required')
        .isLength({ max: 100 })
        .withMessage('Address line 1 must be less than 100 characters'),

    body('addressLine2')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('Address line 2 must be less than 100 characters'),

    body('city')
        .trim()
        .notEmpty()
        .withMessage('City is required')
        .isLength({ max: 50 })
        .withMessage('City must be less than 50 characters'),

    body('county')
        .optional()
        .trim()
        .isLength({ max: 50 })
        .withMessage('County must be less than 50 characters'),

    body('postcode')
        .trim()
        .notEmpty()
        .withMessage('Postcode is required')
        .matches(/^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i)
        .withMessage('Please enter a valid UK postcode'),


    // Declaration & Signature
    body('notBankrupt')
        .isBoolean()
        .withMessage('Bankruptcy declaration must be provided')
        .custom((value) => {
            if (value !== true) {
                throw new Error('You must confirm you are not bankrupt');
            }
            return true;
        }),

    body('signature')
        .notEmpty()
        .withMessage('Signature is required'),

    // Consent
    body('termsAccepted')
        .isBoolean()
        .withMessage('Terms acceptance must be true or false')
        .custom((value) => {
            if (value !== true) {
                throw new Error('You must accept the terms and conditions');
            }
            return true;
        }),

    body('privacyAccepted')
        .isBoolean()
        .withMessage('Privacy acceptance must be true or false')
        .custom((value) => {
            if (value !== true) {
                throw new Error('You must accept the privacy policy');
            }
            return true;
        }),

    body('signature')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Signature must be between 2 and 100 characters'),
];


// Validation result handler
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorDetails = errors.array().map(error => ({
            field: error.path || error.param,
            message: error.msg,
            value: error.value
        }));

        const logger = require('../utils/logger');
        logger.warn('Validation failed:', {
            path: req.path,
            ip: req.realIP || req.ip,
            errors: errorDetails
        });

        return res.status(400).json({
            success: false,
            error: 'Validation failed',
            details: errorDetails
        });
    }
    next();
};

// XSS and injection prevention
const sanitizeInput = (req, res, next) => {
    const sanitize = (obj) => {
        if (typeof obj === 'string') {
            return obj
                .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
                .replace(/javascript:/gi, '')
                .replace(/on\w+\s*=/gi, '')
                .replace(/expression\s*\(/gi, '')
                .trim();
        }
        if (typeof obj === 'object' && obj !== null) {
            const sanitized = Array.isArray(obj) ? [] : {};
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    sanitized[key] = sanitize(obj[key]);
                }
            }
            return sanitized;
        }
        return obj;
    };

    req.body = sanitize(req.body);
    req.query = sanitize(req.query);
    req.params = sanitize(req.params);

    next();
};

// Rate limiting configurations
const strictRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per window
    message: {
        success: false,
        error: 'Too many attempts, please try again later'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const moderateRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per window
    message: {
        success: false,
        error: 'Rate limit exceeded'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// IP-based submission rate limiting
const submissionRateLimit = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // 10 submissions per hour per IP
    message: {
        success: false,
        error: 'Submission limit exceeded. Please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Auto-save rate limiting (more lenient)
const autoSaveRateLimit = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 30, // 30 auto-saves per minute
    message: {
        success: false,
        error: 'Auto-save rate limit exceeded'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = {
    claimValidationRules,
    validate,
    sanitizeInput,
    strictRateLimit,
    moderateRateLimit,
    submissionRateLimit,
    autoSaveRateLimit
};
