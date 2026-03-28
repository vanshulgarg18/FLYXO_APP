const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Movie = sequelize.define('Movie', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  genre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Duration in minutes'
  },
  language: {
    type: DataTypes.STRING,
    allowNull: false
  },
  rating: {
    type: DataTypes.ENUM('U', 'UA', 'A', 'R'),
    allowNull: false,
    comment: 'U - Universal, UA - Parental Guidance, A - Adults Only, R - Restricted'
  },
  minimumAge: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Minimum age required to watch this movie'
  },
  thumbnail: {
    type: DataTypes.STRING,
    allowNull: false
  },
  releaseDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true
});

module.exports = Movie;
