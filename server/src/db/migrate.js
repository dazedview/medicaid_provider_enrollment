const sequelize = require('./config');

const migrateDb = async () => {
  try {
    // Test connection
    await sequelize.authenticate();
    console.log('PostgreSQL connection has been established successfully.');

    // Add missing columns to users table
    console.log('Adding missing columns to users table...');
    
    // Check if address column exists
    const [addressResults] = await sequelize.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'address';
    `);
    
    if (addressResults.length === 0) {
      await sequelize.query(`
        ALTER TABLE users 
        ADD COLUMN address VARCHAR(255),
        ADD COLUMN city VARCHAR(255),
        ADD COLUMN state VARCHAR(255),
        ADD COLUMN "zipCode" VARCHAR(255),
        ADD COLUMN phone VARCHAR(255);
      `);
      console.log('Added missing columns to users table.');
    } else {
      console.log('Columns already exist in users table.');
    }

    console.log('Database migration completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Unable to migrate database:', error);
    process.exit(1);
  }
};

migrateDb();
