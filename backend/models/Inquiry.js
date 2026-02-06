const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
    // Personal Information
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },

    // Inquiry Type
    inquiryType: {
        type: String,
        enum: ['General', 'Claim Status', 'Documentation', 'Payment', 'Commission Disclosure', 'Other'],
        required: true
    },

    // Claim Reference (if related to existing claim)
    relatedClaimRef: {
        type: String,
        trim: true
    },

    // Finance Information (if applicable)
    financeCompany: {
        type: String,
        trim: true
    },
    agreementNumber: {
        type: String,
        trim: true
    },

    // Inquiry Details
    subject: {
        type: String,
        required: true,
        trim: true
    },
    message: {
        type: String,
        required: true
    },

    // Previous Interaction
    previousInquiry: {
        type: Boolean,
        default: false
    },
    previousInquiryDetails: {
        type: String
    },

    // Status
    status: {
        type: String,
        enum: ['New', 'In Review', 'Contacted', 'In Progress', 'Resolved', 'Closed'],
        default: 'New'
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Urgent'],
        default: 'Medium'
    },

    // Additional Information
    urgencyReason: {
        type: String
    },
    preferredContactMethod: {
        type: String,
        enum: ['Email', 'Phone', 'Either'],
        default: 'Email'
    },

    // Consent
    consentToContact: {
        type: Boolean,
        required: true,
        default: false
    },
    consentToDataProcessing: {
        type: Boolean,
        required: true,
        default: false
    },

    // Metadata
    source: {
        type: String,
        default: 'Website'
    },
    ipAddress: {
        type: String
    },
    userAgent: {
        type: String
    },
    location: {
        type: String
    },

    // Response Tracking
    responseDate: {
        type: Date
    },
    responseBy: {
        type: String
    },

    // Admin Notes
    adminNotes: [{
        note: String,
        addedBy: String,
        addedAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

// Indexes for better query performance
inquirySchema.index({ email: 1 });
inquirySchema.index({ status: 1 });
inquirySchema.index({ priority: 1 });
inquirySchema.index({ relatedClaimRef: 1 });
inquirySchema.index({ createdAt: -1 });

module.exports = mongoose.model('Inquiry', inquirySchema);
