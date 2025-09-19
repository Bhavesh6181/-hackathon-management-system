const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  subject: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  status: {
    type: String,
    enum: ['new', 'in_progress', 'resolved', 'closed'],
    default: 'new'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  category: {
    type: String,
    enum: ['bug', 'feature_request', 'general', 'complaint', 'suggestion', 'other'],
    default: 'general'
  },
  adminNotes: {
    type: String,
    maxlength: 1000
  },
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  resolvedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for search and filtering
feedbackSchema.index({ status: 1, priority: 1 });
feedbackSchema.index({ email: 1 });
feedbackSchema.index({ createdAt: -1 });

// Method to mark as resolved
feedbackSchema.methods.markAsResolved = function(adminUserId, notes) {
  this.status = 'resolved';
  this.resolvedBy = adminUserId;
  this.resolvedAt = new Date();
  if (notes) this.adminNotes = notes;
  return this.save();
};

module.exports = mongoose.model('Feedback', feedbackSchema);

