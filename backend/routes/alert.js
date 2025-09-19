const express = require('express');
const { body, validationResult } = require('express-validator');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/alert/send
// @desc    Send alert to authorities and emergency contacts
// @access  Private
router.post('/send', authMiddleware, [
  body('type').isIn(['emergency', 'geofence', 'manual']).withMessage('Invalid alert type'),
  body('message').notEmpty().withMessage('Message is required'),
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
      message,
      location,
      severity = 'medium',
      recipients
    } = req.body;

    // TODO: Implement actual alert sending logic
    // This would integrate with:
    // - Twilio for SMS
    // - WhatsApp Business API
    // - Firebase Cloud Messaging for push notifications
    // - Email service for emergency contacts

    const alertData = {
      touristId: req.tourist.id,
      touristName: `${req.tourist.firstName} ${req.tourist.lastName}`,
      type,
      message,
      location,
      severity,
      timestamp: new Date(),
      recipients: recipients || ['authorities', 'emergency-contacts']
    };

    // Simulate sending alerts
    const alertResults = {
      sms: { sent: true, messageId: 'sms_' + Date.now() },
      whatsapp: { sent: true, messageId: 'wa_' + Date.now() },
      push: { sent: true, messageId: 'push_' + Date.now() },
      authorities: { notified: true, responseTime: '5-10 minutes' }
    };

    res.json({
      success: true,
      message: 'Alerts sent successfully',
      data: {
        alertId: 'alert_' + Date.now(),
        sentAt: new Date(),
        results: alertResults,
        estimatedResponseTime: '5-10 minutes'
      }
    });

  } catch (error) {
    console.error('Send alert error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send alert',
      error: error.message
    });
  }
});

// @route   GET /api/alert/history
// @desc    Get alert history for tourist
// @access  Private
router.get('/history', authMiddleware, async (req, res) => {
  try {
    // TODO: Get actual alert history from database
    // For now, returning mock data

    const alerts = [
      {
        id: 'alert_1',
        type: 'emergency',
        message: 'Medical emergency reported',
        severity: 'high',
        sentAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        status: 'resolved'
      },
      {
        id: 'alert_2',
        type: 'geofence',
        message: 'Entered restricted area',
        severity: 'medium',
        sentAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        status: 'acknowledged'
      }
    ];

    res.json({
      success: true,
      data: { alerts }
    });

  } catch (error) {
    console.error('Get alert history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get alert history',
      error: error.message
    });
  }
});

module.exports = router;