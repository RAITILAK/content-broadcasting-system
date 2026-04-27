const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// A ContentSlot represents a subject-based broadcast channel
// e.g. one slot for "maths", one for "science"
const ContentSlot = sequelize.define('ContentSlot', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  teacher_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
}, {
  tableName: 'content_slots',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = ContentSlot;