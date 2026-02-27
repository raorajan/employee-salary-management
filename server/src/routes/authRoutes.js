const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const ctrl = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

// Validation rules
const registerValidation = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be 3-30 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('role')
    .optional()
    .isIn(['admin', 'manager', 'staff'])
    .withMessage('Role must be admin, manager, or staff')
];

const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

const changePasswordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters')
];

// Routes
router.post('/register', registerValidation, ctrl.register);
router.post('/login', loginValidation, ctrl.login);
router.get('/me', authenticate, ctrl.getMe);
router.post('/change-password', authenticate, changePasswordValidation, ctrl.changePassword);

module.exports = router;
