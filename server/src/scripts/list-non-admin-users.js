const User = require('../models/User');

/**
 * Script to list all users with their roles
 */
async function listAllUsers() {
  try {
    console.log('Fetching all users...\n');
    
    // Find all users
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']]
    });
    
    if (users.length === 0) {
      console.log('No users found in the database.');
      return;
    }
    
    console.log(`Found ${users.length} users:\n`);
    
    // Display user information in a table format
    console.log('ID | Name | Email | Organization | NPI | Role | Registration Date');
    console.log('-'.repeat(100));
    
    users.forEach(user => {
      const name = `${user.firstName} ${user.lastName}`;
      const date = new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      console.log(`${user.id} | ${name} | ${user.email} | ${user.organizationName} | ${user.npi} | ${user.role} | ${date}`);
    });
    
  } catch (err) {
    console.error('Error fetching users:', err.message);
    process.exit(1);
  }
}

// Execute the function
listAllUsers()
  .then(() => {
    console.log('\nScript completed successfully.');
    process.exit(0);
  })
  .catch(err => {
    console.error('Unhandled error:', err);
    process.exit(1);
  });
