const express = require('express');
const { body, validationResult } = require('express-validator');
const Tourist = require('../models/Tourist');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/tourist/profile
// @desc    Get tourist profile
// @access  Private
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const tourist = await Tourist.findById(req.tourist.id);

    res.json({
      success: true,
      data: { tourist }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get profile',
      error: error.message
    });
  }
});

// @route   PUT /api/tourist/location
// @desc    Update tourist location
// @access  Private
router.put('/location', authMiddleware, [
  body('latitude').isFloat({ min: -90, max: 90 }).withMessage('Valid latitude is required'),
  body('longitude').isFloat({ min: -180, max: 180 }).withMessage('Valid longitude is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { latitude, longitude, address } = req.body;

    const tourist = await Tourist.findByIdAndUpdate(
      req.tourist.id,
      {
        currentLocation: {
          latitude,
          longitude,
          address: address || '',
          lastUpdated: new Date()
        }
      },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Location updated successfully',
      data: {
        location: tourist.currentLocation
      }
    });

  } catch (error) {
    console.error('Update location error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update location',
      error: error.message
    });
  }
});

// @route   PUT /api/tourist/emergency-contacts
// @desc    Update emergency contacts
// @access  Private
router.put('/emergency-contacts', authMiddleware, [
  body('emergencyContacts').isArray().withMessage('Emergency contacts must be an array'),
  body('emergencyContacts.*.name').notEmpty().withMessage('Contact name is required'),
  body('emergencyContacts.*.phone').notEmpty().withMessage('Contact phone is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { emergencyContacts } = req.body;

    const tourist = await Tourist.findByIdAndUpdate(
      req.tourist.id,
      { emergencyContacts },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Emergency contacts updated successfully',
      data: {
        emergencyContacts: tourist.emergencyContacts
      }
    });

  } catch (error) {
    console.error('Update emergency contacts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update emergency contacts',
      error: error.message
    });
  }
});

module.exports = router;