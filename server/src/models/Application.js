const { DataTypes } = require('sequelize');
const sequelize = require('../db/config');
const User = require('./User');

const Application = sequelize.define('application', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  applicationType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('Pending', 'In Review', 'Approved', 'Rejected'),
    defaultValue: 'Pending'
  },
  submittedDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  statusUpdateDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  medicaidProviderId: {
    type: DataTypes.STRING(11),
    allowNull: true,
    validate: {
      len: [11, 11]
    }
  },
  formData: {
    type: DataTypes.JSON,
    allowNull: false
  }
}, {
  timestamps: true
});

// Define association with User model
Application.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Application, { foreignKey: 'userId' });

module.exports = Application;
