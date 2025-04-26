const express = require('express');
const { check } = require('express-validator');
const { 
  createApplication, 
  getUserApplications, 
  getApplicationById,
  updateApplicationStatus
} = require('../controllers/applications');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

// Create a new application
router.post(
  '/',
  [
    check('applicationType', 'Application type is required').not().isEmpty(),
    check('formData', 'Form data is required').not().isEmpty()
  ],
  createApplication
);

// Get all applications for the current user
router.get('/', getUserApplications);

// Get a single application by ID
router.get('/:id', getApplicationById);

// Update application status (admin only)
router.put(
  '/:id/status',
  authorize('admin'),
  [
    check('status', 'Status is required').isIn(['Pending', 'In Review', 'Approved', 'Rejected'])
  ],
  updateApplicationStatus
);

module.exports = router;
