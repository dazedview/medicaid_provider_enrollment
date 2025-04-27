const express = require('express');
const { 
  getUsers, 
  getUserById, 
  getAllApplications, 
  getApplicationById, 
  deleteUser,
  deleteApplication,
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
router.delete('/users/:id', deleteUser);

// Application routes
router.get('/applications', getAllApplications);
router.get('/applications/:id', getApplicationById);
router.delete('/applications/:id', deleteApplication);

// Stats route
router.get('/stats', getStats);

module.exports = router;
