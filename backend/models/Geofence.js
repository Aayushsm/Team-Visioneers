const mongoose = require('mongoose');

const geofenceSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: true
  },
  description: String,
  
  // Geofence Type
  type: {
    type: String,
    enum: ['safe-zone', 'restricted-area', 'tourist-attraction', 'danger-zone', 'medical-facility'],
    required: true
  },
  
  // Zone Classification
  safetyLevel: {
    type: String,
    enum: ['safe', 'caution', 'danger', 'restricted'],
    default: 'safe'
  },
  
  // Geographic Data
  geometry: {
    type: {
      type: String,
      enum: ['Polygon', 'Circle'],
      required: true
    },
    coordinates: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    // For circles: { center: [lng, lat], radius: number_in_meters }
    // For polygons: [[[lng, lat], [lng, lat], ...]]
  },
  
  // Zone Rules and Alerts
  rules: {
    allowEntry: { type: Boolean, default: true },
    requiresPermission: { type: Boolean, default: false },
    alertOnEntry: { type: Boolean, default: false },
    alertOnExit: { type: Boolean, default: false },
    maxStayDuration: Number, // in minutes
    activeHours: {
      start: String, // "HH:MM"
      end: String    // "HH:MM"
    }
  },
  
  // Alert Configuration
  alertConfig: {
    authorities: [{ type: String, enum: ['police', 'medical', 'fire', 'tourist-help'] }],
    emergencyContacts: [String],
    severity: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    customMessage: String
  },
  
  // Metadata
  createdBy: {
    type: String,
    required: true // Authority ID or system
  },
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Statistics
  stats: {
    totalBreaches: { type: Number, default: 0 },
    activeVisitors: { type: Number, default: 0 },
    lastBreach: Date
  }
}, {
  timestamps: true
});

// Geospatial index for location queries
geofenceSchema.index({ geometry: '2dsphere' });
geofenceSchema.index({ type: 1, isActive: 1 });

module.exports = mongoose.model('Geofence', geofenceSchema);