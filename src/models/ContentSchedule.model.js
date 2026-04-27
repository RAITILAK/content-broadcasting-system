const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// Defines rotation order and duration for each content item within a slot
const ContentSchedule = sequelize.define('ContentSchedule', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  content_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'content',
      key: 'id',
    },
  },
  slot_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'content_slots',
      key: 'id',
    },
  },
  rotation_order: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Duration in minutes for this content in rotation',
  },
}, {
  tableName: 'content_schedule',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = ContentSchedule;