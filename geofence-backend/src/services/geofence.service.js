const turf = require('@turf/turf');
const Geofence = require('../models/geofence.model');
const BreachEvent = require('../models/breachEvent.model');

/**
 * Geofence Service - Handles all geofence operations using Turf.js
 */
class GeofenceService {
  /**
   * Create a new geofence polygon
   * @param {Object} geofenceData - Geofence data including polygon, name, etc.
   * @returns {Promise<Object>} - Created geofence
   */
  async createGeofence(geofenceData) {
    try {
      // Validate polygon using Turf.js
      const polygon = geofenceData.polygon;
      
      // Ensure it's a valid GeoJSON polygon
      if (polygon.type !== 'Polygon' || !Array.isArray(polygon.coordinates)) {
        throw new Error('Invalid polygon format: must be a GeoJSON Polygon');
      }
      
      // Validate with Turf.js
      try {
        const turfPolygon = turf.polygon(polygon.coordinates);
        
        // Check if polygon is valid
        if (!turf.booleanValid(turfPolygon)) {
          throw new Error('Invalid polygon: The geometry is not valid');
        }
        
        // Additional validation: Ensure the polygon doesn't self-intersect
        if (!this.isValidPolygon(polygon.coordinates[0])) {
          throw new Error('Invalid polygon: Self-intersecting polygons are not allowed');
        }
      } catch (err) {
        throw new Error(`Polygon validation failed: ${err.message}`);
      }
      
      // Create the geofence
      const geofence = new Geofence(geofenceData);
      await geofence.save();
      
      return geofence;
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Get all active geofences
   * @returns {Promise<Array>} - List of active geofences
   */
  async getAllGeofences() {
    try {
      return await Geofence.find({ active: true });
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Get a geofence by ID
   * @param {string} id - Geofence ID
   * @returns {Promise<Object>} - Geofence object
   */
  async getGeofenceById(id) {
    try {
      const geofence = await Geofence.findById(id);
      if (!geofence) {
        throw new Error('Geofence not found');
      }
      return geofence;
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Update an existing geofence
   * @param {string} id - Geofence ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} - Updated geofence
   */
  async updateGeofence(id, updateData) {
    try {
      // If updating the polygon, validate it
      if (updateData.polygon) {
        const polygon = updateData.polygon;
        
        // Ensure it's a valid GeoJSON polygon
        if (polygon.type !== 'Polygon' || !Array.isArray(polygon.coordinates)) {
          throw new Error('Invalid polygon format: must be a GeoJSON Polygon');
        }
        
        // Validate with Turf.js
        try {
          const turfPolygon = turf.polygon(polygon.coordinates);
          
          // Check if polygon is valid
          if (!turf.booleanValid(turfPolygon)) {
            throw new Error('Invalid polygon: The geometry is not valid');
          }
          
          // Additional validation: Ensure the polygon doesn't self-intersect
          if (!this.isValidPolygon(polygon.coordinates[0])) {
            throw new Error('Invalid polygon: Self-intersecting polygons are not allowed');
          }
        } catch (err) {
          throw new Error(`Polygon validation failed: ${err.message}`);
        }
      }
      
      const geofence = await Geofence.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );
      
      if (!geofence) {
        throw new Error('Geofence not found');
      }
      
      return geofence;
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Delete a geofence (soft delete by setting active to false)
   * @param {string} id - Geofence ID
   * @returns {Promise<Object>} - Deleted geofence
   */
  async deleteGeofence(id) {
    try {
      const geofence = await Geofence.findByIdAndUpdate(
        id,
        { active: false },
        { new: true }
      );
      
      if (!geofence) {
        throw new Error('Geofence not found');
      }
      
      return geofence;
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Check if a point is inside any active geofence
   * @param {Object} coords - Point coordinates {lat, lng}
   * @returns {Promise<Object>} - Breach information or null if no breach
   */
  async checkPoint(coords) {
    try {
      // Convert to GeoJSON point
      const point = turf.point([coords.lng, coords.lat]);
      
      // Get all active geofences
      const geofences = await Geofence.find({ active: true });
      
      // Check each geofence
      for (const geofence of geofences) {
        const polygon = turf.polygon(geofence.polygon.coordinates);
        
        // Check if point is inside polygon
        if (turf.booleanPointInPolygon(point, polygon)) {
          return {
            breach: true,
            geofence: geofence,
            distance: 0 // Inside the polygon
          };
        }
        
        // If not inside, calculate distance to polygon
        const distance = turf.pointToPolygonDistance(point, polygon, { units: 'meters' });
        
        // If very close to the boundary (within 10 meters), consider it a potential risk
        if (distance < 10) {
          return {
            breach: false,
            geofence: geofence,
            distance: distance,
            potentialRisk: true
          };
        }
      }
      
      // No breach detected
      return { breach: false };
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Record a breach event
   * @param {string} touristId - Tourist ID
   * @param {Object} coords - Point coordinates {lat, lng}
   * @param {Object} geofence - Breached geofence
   * @returns {Promise<Object>} - Created breach event
   */
  async recordBreachEvent(touristId, coords, geofence) {
    try {
      const breachEvent = new BreachEvent({
        touristId,
        geofenceId: geofence._id,
        coordinates: coords,
        zoneType: geofence.zoneType,
        severity: geofence.severity
      });
      
      await breachEvent.save();
      return breachEvent;
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Check if multiple points (bulk check) are inside any geofence
   * @param {Array} checkRequests - Array of {touristId, coords} objects
   * @returns {Promise<Array>} - Array of breach check results
   */
  async bulkCheckPoints(checkRequests) {
    try {
      // Get all active geofences once
      const geofences = await Geofence.find({ active: true });
      
      // Process each check request
      const results = [];
      
      for (const request of checkRequests) {
        const { touristId, coords } = request;
        
        // Convert to GeoJSON point
        const point = turf.point([coords.lng, coords.lat]);
        
        let breachDetected = false;
        let breachedGeofence = null;
        
        // Check each geofence
        for (const geofence of geofences) {
          const polygon = turf.polygon(geofence.polygon.coordinates);
          
          // Check if point is inside polygon
          if (turf.booleanPointInPolygon(point, polygon)) {
            breachDetected = true;
            breachedGeofence = geofence;
            
            // Record the breach event
            await this.recordBreachEvent(touristId, coords, geofence);
            
            break; // Stop checking other geofences after first breach
          }
        }
        
        // Add result to the array
        results.push({
          touristId,
          breach: breachDetected,
          ...(breachedGeofence && {
            geofence: {
              id: breachedGeofence._id,
              name: breachedGeofence.name,
              zoneType: breachedGeofence.zoneType,
              severity: breachedGeofence.severity
            }
          })
        });
      }
      
      return results;
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Helper function to check if a polygon is valid (no self-intersections)
   * @param {Array} coordinates - Array of [lng, lat] points
   * @returns {boolean} - True if valid, false otherwise
   */
  isValidPolygon(coordinates) {
    try {
      // Create line segments from consecutive points
      const segments = [];
      for (let i = 0; i < coordinates.length - 1; i++) {
        segments.push([coordinates[i], coordinates[i + 1]]);
      }
      
      // Check for intersections between non-adjacent segments
      for (let i = 0; i < segments.length; i++) {
        for (let j = i + 2; j < segments.length; j++) {
          // Skip adjacent segments (they share a point)
          if (i === 0 && j === segments.length - 1) continue;
          
          // Check if segments intersect
          const line1 = turf.lineString(segments[i]);
          const line2 = turf.lineString(segments[j]);
          
          if (turf.booleanIntersects(line1, line2)) {
            return false;
          }
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error validating polygon:', error);
      return false;
    }
  }
}

module.exports = new GeofenceService();