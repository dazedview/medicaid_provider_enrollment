const User = require('../models/User');
const sequelize = require('../db/config');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Regular user data
const userData = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  password: 'password123',  // This will be hashed by the User model's beforeCreate hook
  organizationName: 'Healthcare Provider Inc.',
  npi: '9876543210',
  address: '123 Main St',
  city: 'Anytown',
  state: 'TX',
  zipCode: '78701',
  phone: '(555) 123-4567',
  // role is not specified, so it will default to 'provider'
};

// Function to create regular user
async function createRegularUser() {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('Connected to database');

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email: userData.email } });
    
    if (existingUser) {
      console.log('User with this email already exists');
      return;
    }

    // Create regular user
    const user = await User.create(userData);
    console.log('Regular user created successfully');
    console.log('Email:', userData.email);
    console.log('Password:', 'password123');  // Show the password in plain text for testing purposes
    
  } catch (error) {
    console.error('Error creating regular user:', error);
  } finally {
    // Close database connection
    await sequelize.close();
    console.log('Database connection closed');
  }
}

// Run the function
createRegularUser();
