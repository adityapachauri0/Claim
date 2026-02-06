const mongoose = require('mongoose');

const contactSubmissionSchema = new mongoose.Schema({
    // Contact Information
    name: {
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
        trim: true
    },

    // Subject and Message
    subject: {
        type: String,
        required: true,
        trim: true
    },
    message: {
        type: String,
        required: true
    },

    // Category
    category: {
        type: String,
        enum: ['General Inquiry', 'Support', 'Complaint', 'Feedback', 'Partnership', 'Media', 'Other'],
        default: 'General Inquiry'
    },

    // Status
    status: {
        type: String,
        enum: ['New', 'Read', 'Replied', 'Archived', 'Spam'],
        default: 'New'
    },

    // Metadata
    ipAddress: {
        type: String
    },
    userAgent: {
        type: String
    },
    location: {
        type: String
    },
    source: {
        type: String,
        default: 'Contact Form'
    },

    // Response tracking
    readAt: {
        type: Date
    },
    readBy: {
        type: String
    },
    repliedAt: {
        type: Date
    },
    repliedBy: {
        type: String
    },
    replyContent: {
        type: String
    },

    // Follow-up
    requiresFollowUp: {
        type: Boolean,
        default: false
    },
    followUpDate: {
        type: Date
    },
    followUpNotes: {
        type: String
    },

    // Admin Notes
    adminNotes: {
        type: String
    },
    internalTags: [{
        type: String
    }],

    // Rating (if user rates the response)
    satisfactionRating: {
        type: Number,
        min: 1,
        max: 5
    },
    ratingComment: {
        type: String
    }
}, {
    timestamps: true
});

// Indexes for better query performance
contactSubmissionSchema.index({ email: 1 });
contactSubmissionSchema.index({ status: 1 });
contactSubmissionSchema.index({ category: 1 });
contactSubmissionSchema.index({ createdAt: -1 });
contactSubmissionSchema.index({ requiresFollowUp: 1 });

// Mark as read method
contactSubmissionSchema.methods.markAsRead = function (user) {
    this.status = 'Read';
    this.readAt = new Date();
    this.readBy = user;
    return this.save();
};

// Mark as replied method
contactSubmissionSchema.methods.markAsReplied = function (user, content) {
    this.status = 'Replied';
    this.repliedAt = new Date();
    this.repliedBy = user;
    this.replyContent = content;
    return this.save();
};

module.exports = mongoose.model('ContactSubmission', contactSubmissionSchema);
