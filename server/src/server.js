const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const sequelize = require('./db/config');

// Load env vars
dotenv.config();

// Test database connection
const testDbConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL connection established successfully.');
    
    // Sync models (don't force in production)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync();
      console.log('Database models synchronized.');
    }
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

testDbConnection();

// Route files
const auth = require('./routes/auth');
const applications = require('./routes/applications');
const admin = require('./routes/admin');

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Mount routers
app.use('/api/auth', auth);
app.use('/api/applications', applications);
app.use('/api/admin', admin);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Medicaid Provider Enrollment API' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
