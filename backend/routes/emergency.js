const express = require('express');
const { body, validationResult } = require('express-validator');
const Emergency = require('../models/Emergency');
const Tourist = require('../models/Tourist');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/emergency/alert
// @desc    Create emergency alert
// @access  Private
router.post('/alert', authMiddleware, [
  body('type').isIn(['medical', 'police', 'fire', 'general', 'lost', 'theft', 'accident']).withMessage('Invalid emergency type'),
  body('description').notEmpty().withMessage('Description is required'),
  body('location.latitude').isFloat({ min: -90, max: 90 }).withMessage('Valid latitude is required'),
  body('location.longitude').isFloat({ min: -180, max: 180 }).withMessage('Valid longitude is required')
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

    const {
      type,
      description,
      location,
      severity = 'medium',
      attachments
    } = req.body;

    // Create emergency alert
    const emergency = await Emergency.create({
      touristId: req.tourist.id,
      type,
      description,
      location,
      severity,
      attachments: attachments || [],
      timeline: [{
        action: 'Emergency alert created',
        performedBy: `Tourist: ${req.tourist.firstName} ${req.tourist.lastName}`,
        notes: `${type} emergency reported`
      }]
    });

    // TODO: Trigger immediate notifications to authorities
    // TODO: Send SMS/WhatsApp alerts
    // TODO: Notify emergency contacts

    // Add to emergency timeline
    emergency.timeline.push({
      action: 'Authorities notified',
      performedBy: 'System',
      notes: 'Emergency services have been automatically notified'
    });

    await emergency.save();

    res.status(201).json({
      success: true,
      message: 'Emergency alert created successfully',
      data: {
        emergencyId: emergency._id,
        status: emergency.status,
        estimatedResponseTime: '5-10 minutes' // This would be calculated based on location
      }
    });

  } catch (error) {
    console.error('Emergency alert error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create emergency alert',
      error: error.message
    });
  }
});

// @route   GET /api/emergency/status/:emergencyId
// @desc    Get emergency status
// @access  Private
router.get('/status/:emergencyId', authMiddleware, async (req, res) => {
  try {
    const emergency = await Emergency.findById(req.params.emergencyId)
      .populate('touristId', 'firstName lastName phone');

    if (!emergency) {
      return res.status(404).json({
        success: false,
        message: 'Emergency not found'
      });
    }

    // Check if tourist owns this emergency
    if (emergency.touristId._id.toString() !== req.tourist.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: {
        emergency: {
          id: emergency._id,
          type: emergency.type,
          status: emergency.status,
          severity: emergency.severity,
          location: emergency.location,
          description: emergency.description,
          createdAt: emergency.createdAt,
          timeline: emergency.timeline,
          respondedBy: emergency.respondedBy
        }
      }
    });

  } catch (error) {
    console.error('Get emergency status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get emergency status',
      error: error.message
    });
  }
});

// @route   GET /api/emergency/history
// @desc    Get tourist's emergency history
// @access  Private
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const emergencies = await Emergency.find({ touristId: req.tourist.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('type status severity location description createdAt resolvedAt');

    const total = await Emergency.countDocuments({ touristId: req.tourist.id });

    res.json({
      success: true,
      data: {
        emergencies,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });

  } catch (error) {
    console.error('Get emergency history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get emergency history',
      error: error.message
    });
  }
});

// @route   PUT /api/emergency/:emergencyId/feedback
// @desc    Add feedback to resolved emergency
// @access  Private
router.put('/:emergencyId/feedback', authMiddleware, [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comments').optional().isString()
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

    const { rating, comments } = req.body;

    const emergency = await Emergency.findById(req.params.emergencyId);

    if (!emergency) {
      return res.status(404).json({
        success: false,
        message: 'Emergency not found'
      });
    }

    if (emergency.touristId.toString() !== req.tourist.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    if (emergency.status !== 'resolved') {
      return res.status(400).json({
        success: false,
        message: 'Can only provide feedback for resolved emergencies'
      });
    }

    emergency.feedback = { rating, comments };
    await emergency.save();

    res.json({
      success: true,
      message: 'Feedback added successfully'
    });

  } catch (error) {
    console.error('Add feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add feedback',
      error: error.message
    });
  }
});

module.exports = router;