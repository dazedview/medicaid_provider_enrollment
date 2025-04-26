const express = require('express');
const { check } = require('express-validator');
const { register, login, getMe, updateProfile } = require('../controllers/auth');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post(
  '/register',
  [
    check('firstName', 'First name is required').not().isEmpty(),
    check('lastName', 'Last name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
    check('organizationName', 'Organization name is required').not().isEmpty(),
    check('npi', 'NPI must be a 10-digit number').isLength({ min: 10, max: 10 }).isNumeric()
  ],
  register
);

router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  login
);

router.get('/me', protect, getMe);

router.put('/profile', protect, updateProfile);

module.exports = router;
