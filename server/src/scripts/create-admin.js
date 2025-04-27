const User = require('../models/User');
const sequelize = require('../db/config');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Admin user data
const adminData = {
  firstName: 'Admin',
  lastName: 'User',
  email: 'admin@example.com',
  password: 'admin123',  // This will be hashed by the User model's beforeCreate hook
  organizationName: 'Medicaid Administration',
  npi: '1234567890',
  role: 'admin'
};

// Function to create admin user
async function createAdminUser() {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('Connected to database');

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ where: { email: adminData.email } });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Create admin user
    const admin = await User.create(adminData);
    console.log('Admin user created successfully');
    console.log('Email:', adminData.email);
    console.log('Password:', 'admin123');  // Show the password in plain text for testing purposes
    
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    // Close database connection
    await sequelize.close();
    console.log('Database connection closed');
  }
}

// Run the function
createAdminUser();
