// Base API URL - would be different for production
export const API_BASE_URL = 'https://api.smarttourist.example.com';

// API Endpoints
export const ENDPOINTS = {
  // Authentication
  REGISTER: `${API_BASE_URL}/api/tourist/register`,
  LOGIN: `${API_BASE_URL}/api/tourist/login`,
  
  // Location
  UPDATE_LOCATION: `${API_BASE_URL}/api/tourist/location`,
  
  // Geofences
  GET_GEOFENCES: `${API_BASE_URL}/geofence/all`,
  
  // Emergency
  SEND_SOS: `${API_BASE_URL}/api/emergency/sos`,
  
  // Places
  NEARBY_PLACES: `${API_BASE_URL}/api/places/nearby`,
};

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_PROFILE: 'user_profile',
  DEVICE_ID: 'device_id',
};

// Map Configuration
export const MAP_CONFIG = {
  DEFAULT_LATITUDE: 37.7749,
  DEFAULT_LONGITUDE: -122.4194,
  DEFAULT_ZOOM: 0.01,
  LOCATION_UPDATE_INTERVAL: 30000, // 30 seconds
};

// Geofence Types
export const GEOFENCE_TYPES = {
  SAFE: 'safe',
  RESTRICTED: 'restricted',
  MONITORED: 'monitored',
};

// Notification Types
export const NOTIFICATION_TYPES = {
  GEOFENCE: 'geofence',
  WARNING: 'warning',
  EMERGENCY: 'emergency',
  INFO: 'info',
};

export default {
  API_BASE_URL,
  ENDPOINTS,
  STORAGE_KEYS,
  MAP_CONFIG,
  GEOFENCE_TYPES,
  NOTIFICATION_TYPES,
};