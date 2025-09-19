const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const touristSchema = new mongoose.Schema({
  // Basic Information
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false
  },
  
  // Tourist Specific Information
  nationality: {
    type: String,
    required: true
  },
  passportNumber: {
    type: String,
    required: true,
    unique: true
  },
  visaStatus: {
    type: String,
    enum: ['tourist', 'business', 'student', 'other'],
    default: 'tourist'
  },
  
  // Current Location and Tracking
  currentLocation: {
    latitude: { type: Number },
    longitude: { type: Number },
    address: String,
    lastUpdated: { type: Date, default: Date.now }
  },
  
  // Emergency Contacts
  emergencyContacts: [{
    name: { type: String, required: true },
    relationship: String,
    phone: { type: String, required: true },
    email: String,
    isPrimary: { type: Boolean, default: false }
  }],
  
  // Travel Information
  accommodation: {
    name: String,
    address: String,
    phone: String,
    checkIn: Date,
    checkOut: Date
  },
  
  // Safety Information
  medicalInfo: {
    bloodGroup: String,
    allergies: [String],
    medications: [String],
    medicalConditions: [String]
  },
  
  // App Settings
  preferences: {
    language: { type: String, default: 'en' },
    notifications: {
      emergency: { type: Boolean, default: true },
      location: { type: Boolean, default: true },
      general: { type: Boolean, default: true }
    },
    shareLocation: { type: Boolean, default: true }
  },
  
  // Status and Verification
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  lastSeen: { type: Date, default: Date.now },
  
  // Device Information
  deviceInfo: {
    deviceId: String,
    platform: { type: String, enum: ['ios', 'android'] },
    fcmToken: String // For push notifications
  }
}, {
  timestamps: true
});

// Index for geospatial queries
touristSchema.index({ "currentLocation.latitude": 1, "currentLocation.longitude": 1 });

// Hash password before saving
touristSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
touristSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Get full name virtual
touristSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

module.exports = mongoose.model('Tourist', touristSchema);