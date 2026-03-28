const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Booking = sequelize.define('Booking', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  showId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Shows',
      key: 'id'
    }
  },
  seats: {
    type: DataTypes.JSON,
    allowNull: false,
    comment: 'Array of seat IDs'
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  bookingReference: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  idProofType: {
    type: DataTypes.ENUM('aadhar', 'pan', 'driving_license', 'passport'),
    allowNull: false
  },
  idProofNumber: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('confirmed', 'cancelled'),
    defaultValue: 'confirmed'
  },
  paymentStatus: {
    type: DataTypes.ENUM('pending', 'completed', 'failed'),
    defaultValue: 'completed'
  }
}, {
  timestamps: true
});

module.exports = Booking;
