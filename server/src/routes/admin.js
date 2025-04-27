const express = require('express');
const { 
  getUsers, 
  getUserById, 
  getAllApplications, 
  getApplicationById, 
  getStats 
} = require('../controllers/admin');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

// User routes
router.get('/users', getUsers);
router.get('/users/:id', getUserById);

// Application routes
router.get('/applications', getAllApplications);
router.get('/applications/:id', getApplicationById);

// Stats route
router.get('/stats', getStats);

module.exports = router;
