const mongoose = require('mongoose');

const draftSchema = new mongoose.Schema({
    sessionId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    formType: {
        type: String,
        required: true,
        default: 'claim'
    },
    formData: {
        type: Object,
        required: true
    },
    currentStep: {
        type: Number,
        default: 1
    },
    completionPercentage: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    ipAddress: {
        type: String,
        default: '127.0.0.1'
    },
    location: {
        type: String,
        default: 'Unknown'
    },
    userAgent: {
        type: String
    },
    lastSaved: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['draft', 'converted', 'expired'],
        default: 'draft'
    }
}, {
    timestamps: true
});

// Auto-delete old drafts after 30 days (2592000 seconds)
draftSchema.index({ lastSaved: 1 }, { expireAfterSeconds: 2592000 });

// Calculate completion percentage before saving
draftSchema.pre('save', function (next) {
    if (this.formData) {
        const data = this.formData;

        // Define required fields for each step
        const step1Fields = ['firstName', 'lastName', 'email', 'phone', 'dob'];
        const step2Fields = ['addressLine1', 'city', 'postcode'];
        const step3Fields = ['financeType', 'financePeriodStart', 'financePeriodEnd'];
        const step4Fields = ['termsAccepted', 'privacyAccepted'];

        const allFields = [...step1Fields, ...step2Fields, ...step3Fields, ...step4Fields];

        // Count filled fields - handle both flat and nested structure
        let filledCount = 0;

        // Helper to check if field has value
        const hasValue = (val) => val !== undefined && val !== null && val !== '' && val !== false;

        // Check flat structure first (current ClaimForm)
        step1Fields.forEach(field => {
            if (hasValue(data[field])) {
                filledCount++;
            } else if (data.personalDetails && hasValue(data.personalDetails[field])) {
                filledCount++;
            }
        });

        step2Fields.forEach(field => {
            if (hasValue(data[field])) {
                filledCount++;
            } else if (data.address?.current && hasValue(data.address.current[field])) {
                filledCount++;
            }
        });

        step3Fields.forEach(field => {
            if (hasValue(data[field])) {
                filledCount++;
            } else if (data.claimDetails && hasValue(data.claimDetails[field])) {
                filledCount++;
            }
        });

        step4Fields.forEach(field => {
            if (hasValue(data[field])) {
                filledCount++;
            } else if (data.consent && hasValue(data.consent[field])) {
                filledCount++;
            }
        });

        this.completionPercentage = Math.round((filledCount / allFields.length) * 100);
    }
    next();
});

// Static method to get draft stats
draftSchema.statics.getStats = async function () {
    const total = await this.countDocuments();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayCount = await this.countDocuments({
        createdAt: { $gte: today }
    });

    const avgCompletion = await this.aggregate([
        {
            $group: {
                _id: null,
                avgCompletion: { $avg: '$completionPercentage' }
            }
        }
    ]);

    return {
        total,
        today: todayCount,
        averageCompletion: avgCompletion[0]?.avgCompletion || 0
    };
};

module.exports = mongoose.model('Draft', draftSchema);
