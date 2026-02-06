/**
 * Email validation utility
 */

/**
 * Validate email format
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if valid email format
 */
function isValidEmail(email) {
    if (!email || typeof email !== 'string') {
        return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim().toLowerCase());
}

/**
 * Sanitize email address
 * @param {string} email - Email address to sanitize
 * @returns {string} - Sanitized email address
 */
function sanitizeEmail(email) {
    if (!email || typeof email !== 'string') {
        return '';
    }

    return email.trim().toLowerCase();
}

/**
 * Validate email format with detailed response
 * @param {string} email - Email address to validate
 * @returns {object} - Validation result with isValid boolean and error message
 */
function validate(email) {
    if (!email || typeof email !== 'string') {
        return {
            isValid: false,
            error: 'Email is required'
        };
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Check for empty string
    if (trimmedEmail === '') {
        return {
            isValid: false,
            error: 'Email is required'
        };
    }

    // Check for @ symbol
    if (!trimmedEmail.includes('@')) {
        return {
            isValid: false,
            error: 'Email must contain @ symbol'
        };
    }

    // Check format with regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(trimmedEmail);

    return {
        isValid: isValid,
        error: isValid ? null : 'Invalid email format'
    };
}

/**
 * Check if email domain is valid (not a disposable email)
 * @param {string} email - Email address to check
 * @returns {boolean} - True if domain appears valid
 */
function hasValidDomain(email) {
    if (!isValidEmail(email)) {
        return false;
    }

    const domain = email.split('@')[1].toLowerCase();

    // List of common disposable email domains
    const disposableDomains = [
        'tempmail.com', 'throwaway.com', 'mailinator.com',
        'guerrillamail.com', '10minutemail.com', 'temp-mail.org'
    ];

    return !disposableDomains.includes(domain);
}

module.exports = {
    isValidEmail,
    sanitizeEmail,
    validate,
    hasValidDomain
};
