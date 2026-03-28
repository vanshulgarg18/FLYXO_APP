const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Seat = sequelize.define('Seat', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  showId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Shows',
      key: 'id'
    }
  },
  seatNumber: {
    type: DataTypes.STRING,
    allowNull: false
  },
  row: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('available', 'locked', 'booked'),
    defaultValue: 'available'
  },
  lockedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  lockedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['showId', 'seatNumber']
    }
  ]
});

module.exports = Seat;
