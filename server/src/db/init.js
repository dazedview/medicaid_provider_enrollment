const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
const path = require('path');

// Load env variables
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: process.env.NODE_ENV === 'production'
        ? { require: true, rejectUnauthorized: false }
        : false,
    },
  }
);
const User = require('../models/User');
const Application = require('../models/Application');

const initDb = async () => {
  try {
    // Test connection
    await sequelize.authenticate();
    console.log('PostgreSQL connection has been established successfully.');

    // Sync all models (create tables)
    await sequelize.sync({ force: true });
    console.log('All models were synchronized successfully.');

    // List all tables in the database
    const [results] = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    
    console.log('Tables in the database:');
    results.forEach(result => {
      console.log(`- ${result.table_name}`);
    });

    // Check if applications table exists
    if (!results.some(result => result.table_name === 'applications')) {
      console.log('Applications table does not exist. Creating it manually...');
      
      // Create applications table manually
      await sequelize.query(`
        CREATE TABLE IF NOT EXISTS applications (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          "userId" UUID NOT NULL REFERENCES users(id),
          "applicationType" VARCHAR(255) NOT NULL,
          status VARCHAR(255) DEFAULT 'Pending',
          "submittedDate" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          "statusUpdateDate" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          notes TEXT,
          "formData" JSONB NOT NULL,
          "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
          "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL
        );
      `);
      
      console.log('Applications table created manually.');
    }

    console.log('Database initialized successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Unable to initialize database:', error);
    process.exit(1);
  }
};

initDb();
