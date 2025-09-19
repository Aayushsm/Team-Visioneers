const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const Tourist = require('../models/Tourist');

const router = express.Router();

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// @route   POST /api/auth/register
// @desc    Register a new tourist
// @access  Public
router.post('/register', [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('phone').isMobilePhone().withMessage('Please enter a valid phone number'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('nationality').notEmpty().withMessage('Nationality is required'),
  body('passportNumber').notEmpty().withMessage('Passport number is required')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      nationality,
      passportNumber,
      emergencyContacts,
      medicalInfo
    } = req.body;

    // Check if tourist already exists
    const existingTourist = await Tourist.findOne({
      $or: [{ email }, { phone }, { passportNumber }]
    });

    if (existingTourist) {
      return res.status(400).json({
        success: false,
        message: 'Tourist already exists with this email, phone, or passport number'
      });
    }

    // Create new tourist
    const tourist = await Tourist.create({
      firstName,
      lastName,
      email,
      phone,
      password,
      nationality,
      passportNumber,
      emergencyContacts,
      medicalInfo
    });

    // Generate token
    const token = generateToken(tourist._id);

    res.status(201).json({
      success: true,
      message: 'Tourist registered successfully',
      data: {
        tourist: {
          id: tourist._id,
          firstName: tourist.firstName,
          lastName: tourist.lastName,
          email: tourist.email,
          phone: tourist.phone,
          nationality: tourist.nationality
        },
        token
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login tourist
// @access  Public
router.post('/login', [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').notEmpty().withMessage('Password is required')
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

    const { email, password } = req.body;

    // Find tourist and include password for comparison
    const tourist = await Tourist.findOne({ email }).select('+password');

    if (!tourist) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await tourist.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update last seen
    tourist.lastSeen = new Date();
    await tourist.save();

    // Generate token
    const token = generateToken(tourist._id);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        tourist: {
          id: tourist._id,
          firstName: tourist.firstName,
          lastName: tourist.lastName,
          email: tourist.email,
          phone: tourist.phone,
          nationality: tourist.nationality,
          isVerified: tourist.isVerified
        },
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
});

// @route   POST /api/auth/verify-token
// @desc    Verify JWT token
// @access  Private
router.post('/verify-token', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const tourist = await Tourist.findById(decoded.id);

    if (!tourist) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }

    res.json({
      success: true,
      message: 'Token is valid',
      data: {
        tourist: {
          id: tourist._id,
          firstName: tourist.firstName,
          lastName: tourist.lastName,
          email: tourist.email,
          isVerified: tourist.isVerified
        }
      }
    });

  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token',
      error: error.message
    });
  }
});

module.exports = router;