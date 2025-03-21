const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Register a new user
router.post('/register', authController.register);

// Login user
router.post('/login', authController.login);

// Get current user profile
router.get('/me', protect, authController.getProfile);

// Update user profile
router.put('/profile', protect, authController.updateProfile);

// Change password
router.put('/password', protect, authController.changePassword);

// Forgot password - send reset email
router.post('/forgot-password', authController.forgotPassword);

// Reset password with token
router.post('/reset-password', authController.resetPassword);

// Logout user (client-side)
router.post('/logout', authController.logout);

// Verify JWT token
router.get('/verify', protect, authController.verifyToken);

module.exports = router;