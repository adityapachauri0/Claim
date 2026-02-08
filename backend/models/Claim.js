const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema({
  // Personal Details
  title: {
    type: String,
    enum: ['Mr', 'Mrs', 'Miss', 'Ms', 'Dr', 'Other'],
    required: function () { return !this.isDraft; }
  },
  firstName: {
    type: String,
    required: function () { return !this.isDraft; },
    trim: true
  },
  lastName: {
    type: String,
    required: function () { return !this.isDraft; },
    trim: true
  },
  email: {
    type: String,
    required: function () { return !this.isDraft; },
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: function () { return !this.isDraft; },
    trim: true
  },
  dateOfBirth: {
    type: Date,
    required: function () { return !this.isDraft; }
  },

  // Address Information
  addressLine1: { type: String, required: function () { return !this.isDraft; } },
  addressLine2: { type: String },
  city: { type: String, required: function () { return !this.isDraft; } },
  county: { type: String },
  postcode: { type: String, required: function () { return !this.isDraft; } },

  hasPreviousAddress: {
    type: Boolean,
    default: false
  },
  prevAddressLine1: { type: String },
  prevAddressLine2: { type: String },
  prevCity: { type: String },
  prevPostcode: { type: String },

  // Additional Details (optional)
  lenders: [{
    type: String
  }],
  vehicleMake: { type: String },
  vehicleModel: { type: String },
  vehicleYear: { type: String },
  vehicleRegistrationNumber: { type: String },
  estimatedValue: {
    type: String
  },
  additionalInfo: {
    type: String,
    maxlength: 2000
  },

  // Consent and Legal
  notBankrupt: {
    type: Boolean,
    required: function () { return !this.isDraft; },
    default: false
  },
  signature: {
    type: String  // Base64 PNG image
  },
  termsAccepted: {
    type: Boolean,
    required: function () { return !this.isDraft; },
    default: false
  },
  privacyAccepted: {
    type: Boolean,
    required: function () { return !this.isDraft; },
    default: false
  },
  marketingOptIn: {
    type: Boolean,
    default: false
  },
  signature: {
    type: String,
    required: function () { return !this.isDraft; }
  },
  signedAt: {
    type: Date,
    default: Date.now
  },

  // Claim Status
  status: {
    type: String,
    enum: ['new', 'reviewing', 'processing', 'submitted', 'approved', 'rejected', 'completed'],
    default: 'new'
  },

  sessionId: {
    type: String,
    index: true,
    sparse: true
  },
  completionPercentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },

  // Reference Number
  referenceNumber: {
    type: String,
    unique: true,
    sparse: true
  },

  // Admin Notes
  adminNotes: [{
    note: String,
    createdBy: String,
    createdAt: { type: Date, default: Date.now }
  }],

  // Tracking & Metadata
  source: {
    type: String,
    default: 'website'
  },
  ipAddress: String,
  location: String,
  userAgent: String,
  referrer: String,

  // CRM Integration
  crmSynced: {
    type: Boolean,
    default: false
  },
  crmLeadId: {
    type: String,
    sparse: true
  },
  crmSyncDate: Date,
  crmSyncError: String

}, {
  timestamps: true
});

// Indexes for faster queries
claimSchema.index({ email: 1 });
claimSchema.index({ status: 1 });
claimSchema.index({ createdAt: -1 });

// Virtual for full name
claimSchema.virtual('fullName').get(function () {
  return `${this.title || ''} ${this.firstName || ''} ${this.lastName || ''}`.trim();
});

// Calculate completion percentage before saving
claimSchema.pre('save', function (next) {
  // Calculate completion percentage
  const fields = [
    'firstName', 'lastName', 'email', 'phone', 'dateOfBirth',
    'addressLine1', 'city', 'postcode',
    'termsAccepted'
  ];

  let filledCount = 0;
  fields.forEach(field => {
    const value = this[field];
    if (value !== undefined && value !== null && value !== '' && value !== false) {
      filledCount++;
    }
  });

  this.completionPercentage = Math.round((filledCount / fields.length) * 100);

  // Generate reference number
  if (!this.referenceNumber) {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.referenceNumber = `CLM-${timestamp}-${random}`;
  }

  next();
});

// Static methods
claimSchema.statics.getMetrics = async function () {
  const query = { isDraft: { $ne: true } };
  const total = await this.countDocuments(query);
  const newCount = await this.countDocuments({ ...query, status: 'new' });
  const processing = await this.countDocuments({ ...query, status: 'processing' });
  const approved = await this.countDocuments({ ...query, status: 'approved' });
  const completed = await this.countDocuments({ ...query, status: 'completed' });

  // Today's submissions (start of current calendar day)
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const recentSubmissions = await this.countDocuments({
    ...query,
    createdAt: { $gte: todayStart }
  });

  return {
    total,
    new: newCount,
    processing,
    approved,
    completed,
    recentSubmissions,
    conversionRate: total > 0 ? ((completed / total) * 100).toFixed(1) : 0
  };
};

module.exports = mongoose.model('Claim', claimSchema);

