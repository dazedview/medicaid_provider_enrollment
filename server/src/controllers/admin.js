const User = require('../models/User');
const Application = require('../models/Application');
const { Op } = require('sequelize');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']]
    });

    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Get user by ID
// @route   GET /api/admin/users/:id
// @access  Private/Admin
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Get all applications
// @route   GET /api/admin/applications
// @access  Private/Admin
exports.getAllApplications = async (req, res) => {
  try {
    const applications = await Application.findAll({
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName', 'email', 'organizationName', 'npi']
        }
      ],
      order: [['submittedDate', 'DESC']]
    });

    res.json(applications);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Get application by ID (admin view)
// @route   GET /api/admin/applications/:id
// @access  Private/Admin
exports.getApplicationById = async (req, res) => {
  try {
    const application = await Application.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName', 'email', 'organizationName', 'npi', 'address', 'city', 'state', 'zipCode', 'phone']
        }
      ]
    });

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.json(application);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Get application statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getStats = async (req, res) => {
  try {
    // Get total users count
    const totalUsers = await User.count();
    
    // Get total applications count
    const totalApplications = await Application.count();
    
    // Get applications by status
    const pending = await Application.count({ where: { status: 'Pending' } });
    const inReview = await Application.count({ where: { status: 'In Review' } });
    const approved = await Application.count({ where: { status: 'Approved' } });
    const rejected = await Application.count({ where: { status: 'Rejected' } });
    
    // Get recent applications (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentApplications = await Application.count({
      where: {
        submittedDate: {
          [Op.gte]: thirtyDaysAgo
        }
      }
    });
    
    res.json({
      users: {
        total: totalUsers
      },
      applications: {
        total: totalApplications,
        recent: recentApplications,
        byStatus: {
          pending,
          inReview,
          approved,
          rejected
        }
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
};
