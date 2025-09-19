import axios from 'axios';
import { ENDPOINTS } from '../utils/constants';

// Create axios instance with common configuration
const apiClient = axios.create({
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include auth token
apiClient.interceptors.request.use(
  async config => {
    // In a real app, we would get the token from AsyncStorage
    const token = null; // await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Authentication Services
export const authService = {
  // Register a new user
  register: async (userData) => {
    try {
      const response = await apiClient.post(ENDPOINTS.REGISTER, userData);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },
  
  // Login an existing user
  login: async (credentials) => {
    try {
      const response = await apiClient.post(ENDPOINTS.LOGIN, credentials);
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
};

// Location Services
export const locationService = {
  // Update user's current location
  updateLocation: async (locationData) => {
    try {
      const response = await apiClient.post(ENDPOINTS.UPDATE_LOCATION, locationData);
      return response.data;
    } catch (error) {
      console.error('Location update error:', error);
      throw error;
    }
  },
  
  // Get all geofences
  getGeofences: async () => {
    try {
      const response = await apiClient.get(ENDPOINTS.GET_GEOFENCES);
      return response.data;
    } catch (error) {
      console.error('Geofence fetch error:', error);
      throw error;
    }
  },
};

// Emergency Services
export const emergencyService = {
  // Send SOS alert
  sendSOS: async (emergencyData) => {
    try {
      const response = await apiClient.post(ENDPOINTS.SEND_SOS, emergencyData);
      return response.data;
    } catch (error) {
      console.error('SOS alert error:', error);
      throw error;
    }
  },
};

// Places Services
export const placesService = {
  // Get nearby places
  getNearbyPlaces: async (params) => {
    try {
      const response = await apiClient.get(ENDPOINTS.NEARBY_PLACES, { params });
      return response.data;
    } catch (error) {
      console.error('Nearby places error:', error);
      throw error;
    }
  },
};

export default {
  authService,
  locationService,
  emergencyService,
  placesService,
};