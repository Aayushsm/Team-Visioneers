const mongoose = require('mongoose');

const emergencySchema = new mongoose.Schema({
  // Tourist Information
  touristId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tourist',
    required: true
  },
  
  // Emergency Details
  type: {
    type: String,
    enum: ['medical', 'police', 'fire', 'general', 'lost', 'theft', 'accident'],
    required: true
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['active', 'in-progress', 'resolved', 'false-alarm'],
    default: 'active'
  },
  
  // Location Information
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    address: String,
    accuracy: Number
  },
  
  // Emergency Description
  description: {
    type: String,
    required: true
  },
  
  // Media attachments (photos, audio)
  attachments: [{
    type: { type: String, enum: ['image', 'audio', 'video'] },
    url: String,
    filename: String
  }],
  
  // Response Information
  respondedBy: [{
    authority: { type: String, enum: ['police', 'medical', 'fire', 'tourist-help'] },
    responderId: String,
    responseTime: Date,
    status: { type: String, enum: ['dispatched', 'en-route', 'on-scene', 'resolved'] }
  }],
  
  // Timeline
  timeline: [{
    timestamp: { type: Date, default: Date.now },
    action: String,
    performedBy: String,
    notes: String
  }],
  
  // Communication
  notificationsSent: [{
    type: { type: String, enum: ['sms', 'call', 'push', 'whatsapp'] },
    recipient: String,
    timestamp: { type: Date, default: Date.now },
    status: { type: String, enum: ['sent', 'delivered', 'failed'] }
  }],
  
  // Resolution
  resolvedAt: Date,
  resolutionNotes: String,
  feedback: {
    rating: { type: Number, min: 1, max: 5 },
    comments: String
  }
}, {
  timestamps: true
});

// Index for geospatial queries
emergencySchema.index({ "location.latitude": 1, "location.longitude": 1 });
emergencySchema.index({ touristId: 1, createdAt: -1 });
emergencySchema.index({ status: 1, severity: 1 });

module.exports = mongoose.model('Emergency', emergencySchema);