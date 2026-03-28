const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Show = sequelize.define('Show', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  movieId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Movies',
      key: 'id'
    }
  },
  showDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  showTime: {
    type: DataTypes.TIME,
    allowNull: false
  },
  screen: {
    type: DataTypes.STRING,
    allowNull: false
  },
  totalSeats: {
    type: DataTypes.INTEGER,
    defaultValue: 100
  },
  availableSeats: {
    type: DataTypes.INTEGER,
    defaultValue: 100
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true
});

module.exports = Show;
