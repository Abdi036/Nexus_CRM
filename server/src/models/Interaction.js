const mongoose = require('mongoose');

const interactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['call', 'email', 'meeting'],
    required: [true, 'Interaction type is required']
  },
  notes: {
    type: String,
    required: [true, 'Notes are required'],
    trim: true,
    maxlength: [2000, 'Notes cannot exceed 2000 characters']
  },
  linkedTo: {
    type: String,
    enum: ['lead', 'customer'],
    required: [true, 'Linked entity type is required']
  },
  linkedId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Linked entity ID is required'],
    refPath: 'linkedModel'
  },
  linkedModel: {
    type: String,
    enum: ['Lead', 'Customer'],
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Set linkedModel based on linkedTo before validation
interactionSchema.pre('validate', function(next) {
  if (this.linkedTo === 'lead') {
    this.linkedModel = 'Lead';
  } else if (this.linkedTo === 'customer') {
    this.linkedModel = 'Customer';
  }
  next();
});

module.exports = mongoose.model('Interaction', interactionSchema);
