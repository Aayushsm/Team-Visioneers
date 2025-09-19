import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Backend API configuration
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api'  // Development
  : 'https://your-production-api.com/api'; // Production

// Storage keys
const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data'
};

// Create axios instance with common configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // 15 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include auth token
apiClient.interceptors.request.use(
  async config => {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting auth token:', error);
    }
    
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear storage and redirect to login
      await AsyncStorage.multiRemove([STORAGE_KEYS.AUTH_TOKEN, STORAGE_KEYS.USER_DATA]);
    }
    return Promise.reject(error);
  }
);

// Authentication Services
export const authService = {
  // Register a new tourist
  register: async (userData) => {
    try {
      const response = await apiClient.post('/auth/register', userData);
      
      if (response.data.success && response.data.data.token) {
        // Store token and user data
        await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.data.data.token);
        await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.data.data.tourist));
      }
      
      return response.data;
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      throw error.response?.data || error;
    }
  },
  
  // Login an existing tourist
  login: async (credentials) => {
    try {
      const response = await apiClient.post('/auth/login', credentials);
      
      if (response.data.success && response.data.data.token) {
        // Store token and user data
        await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.data.data.token);
        await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.data.data.tourist));
      }
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      throw error.response?.data || error;
    }
  },

  // Logout user
  logout: async () => {
    try {
      // Clear stored data
      await AsyncStorage.multiRemove([STORAGE_KEYS.AUTH_TOKEN, STORAGE_KEYS.USER_DATA]);
      return { success: true, message: 'Logged out successfully' };
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  // Verify token
  verifyToken: async () => {
    try {
      const response = await apiClient.post('/auth/verify-token');
      return response.data;
    } catch (error) {
      console.error('Token verification error:', error);
      throw error.response?.data || error;
    }
  }
};

// Tourist Services
export const touristService = {
  // Get tourist profile
  getProfile: async () => {
    try {
      const response = await apiClient.get('/tourist/profile');
      return response.data;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error.response?.data || error;
    }
  },

  // Update tourist location
  updateLocation: async (locationData) => {
    try {
      const response = await apiClient.put('/tourist/location', locationData);
      return response.data;
    } catch (error) {
      console.error('Location update error:', error);
      throw error.response?.data || error;
    }
  },

  // Update emergency contacts
  updateEmergencyContacts: async (emergencyContacts) => {
    try {
      const response = await apiClient.put('/tourist/emergency-contacts', { emergencyContacts });
      return response.data;
    } catch (error) {
      console.error('Update emergency contacts error:', error);
      throw error.response?.data || error;
    }
  }
};

// Emergency Services
export const emergencyService = {
  // Create emergency alert
  createAlert: async (emergencyData) => {
    try {
      const response = await apiClient.post('/emergency/alert', emergencyData);
      return response.data;
    } catch (error) {
      console.error('Create emergency alert error:', error);
      throw error.response?.data || error;
    }
  },

  // Get emergency status
  getEmergencyStatus: async (emergencyId) => {
    try {
      const response = await apiClient.get(`/emergency/status/${emergencyId}`);
      return response.data;
    } catch (error) {
      console.error('Get emergency status error:', error);
      throw error.response?.data || error;
    }
  },

  // Get emergency history
  getEmergencyHistory: async (page = 1, limit = 10) => {
    try {
      const response = await apiClient.get(`/emergency/history?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Get emergency history error:', error);
      throw error.response?.data || error;
    }
  },

  // Add feedback to emergency
  addFeedback: async (emergencyId, feedback) => {
    try {
      const response = await apiClient.put(`/emergency/${emergencyId}/feedback`, feedback);
      return response.data;
    } catch (error) {
      console.error('Add feedback error:', error);
      throw error.response?.data || error;
    }
  }
};

// Location and Geofence Services
export const geofenceService = {
  // Check geofences for current location
  checkGeofences: async (latitude, longitude) => {
    try {
      const response = await apiClient.get(`/geofence/check?latitude=${latitude}&longitude=${longitude}`);
      return response.data;
    } catch (error) {
      console.error('Geofence check error:', error);
      throw error.response?.data || error;
    }
  },

  // Get nearby geofences
  getNearbyGeofences: async (latitude, longitude, radius = 1000) => {
    try {
      const response = await apiClient.get(`/geofence/nearby?latitude=${latitude}&longitude=${longitude}&radius=${radius}`);
      return response.data;
    } catch (error) {
      console.error('Get nearby geofences error:', error);
      throw error.response?.data || error;
    }
  }
};

// Alert Services
export const alertService = {
  // Send alert
  sendAlert: async (alertData) => {
    try {
      const response = await apiClient.post('/alert/send', alertData);
      return response.data;
    } catch (error) {
      console.error('Send alert error:', error);
      throw error.response?.data || error;
    }
  },

  // Get alert history
  getAlertHistory: async () => {
    try {
      const response = await apiClient.get('/alert/history');
      return response.data;
    } catch (error) {
      console.error('Get alert history error:', error);
      throw error.response?.data || error;
    }
  }
};

// Utility function to get stored user data
export const getStoredUserData = async () => {
  try {
    const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting stored user data:', error);
    return null;
  }
};

// Utility function to check if user is authenticated
export const isAuthenticated = async () => {
  try {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    return !!token;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
};

// Default export with all services
export default {
  authService,
  touristService,
  emergencyService,
  locationService,
  geofenceService,
  alertService,
  getStoredUserData,
  isAuthenticated
};