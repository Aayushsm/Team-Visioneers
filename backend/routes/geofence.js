const express = require('express');
const { body, validationResult } = require('express-validator');
const Geofence = require('../models/Geofence');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/geofence/check
// @desc    Check if tourist is in any geofences
// @access  Private
router.get('/check', authMiddleware, async (req, res) => {
  try {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    // Find geofences that contain this point
    const geofences = await Geofence.find({
      isActive: true,
      geometry: {
        $geoIntersects: {
          $geometry: {
            type: "Point",
            coordinates: [lng, lat]
          }
        }
      }
    });

    const alerts = [];
    const safeZones = [];
    const restrictions = [];

    geofences.forEach(geofence => {
      const zoneInfo = {
        id: geofence._id,
        name: geofence.name,
        type: geofence.type,
        safetyLevel: geofence.safetyLevel,
        rules: geofence.rules
      };

      if (geofence.rules.alertOnEntry) {
        alerts.push({
          ...zoneInfo,
          alertType: 'entry',
          message: geofence.alertConfig.customMessage || `You have entered ${geofence.name}`,
          severity: geofence.alertConfig.severity
        });
      }

      if (geofence.safetyLevel === 'safe') {
        safeZones.push(zoneInfo);
      } else if (geofence.safetyLevel === 'danger' || geofence.safetyLevel === 'restricted') {
        restrictions.push(zoneInfo);
      }
    });

    res.json({
      success: true,
      data: {
        inGeofences: geofences.length > 0,
        currentZones: geofences.map(g => ({
          id: g._id,
          name: g.name,
          type: g.type,
          safetyLevel: g.safetyLevel
        })),
        alerts,
        safeZones,
        restrictions
      }
    });

  } catch (error) {
    console.error('Geofence check error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check geofences',
      error: error.message
    });
  }
});

// @route   GET /api/geofence/nearby
// @desc    Get nearby geofences
// @access  Private
router.get('/nearby', authMiddleware, async (req, res) => {
  try {
    const { latitude, longitude, radius = 1000 } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    const radiusInMeters = parseInt(radius);

    const nearbyGeofences = await Geofence.find({
      isActive: true,
      geometry: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [lng, lat]
          },
          $maxDistance: radiusInMeters
        }
      }
    }).limit(20);

    res.json({
      success: true,
      data: {
        geofences: nearbyGeofences.map(g => ({
          id: g._id,
          name: g.name,
          type: g.type,
          safetyLevel: g.safetyLevel,
          description: g.description,
          rules: g.rules
        }))
      }
    });

  } catch (error) {
    console.error('Get nearby geofences error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get nearby geofences',
      error: error.message
    });
  }
});

module.exports = router;