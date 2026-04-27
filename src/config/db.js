const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT) || 3306,  // add parseInt!
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

const connectDB = async () => {

  // Add this temporarily to see what values are being used
  console.log('DB Config:', {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD ? '***SET***' : 'UNDEFINED'
  });
  await sequelize.authenticate();
  console.log('MySQL connected successfully');

    // Load all models and associations
  require('../models/index');

  // Sync all models (creates tables if they don't exist)
  await sequelize.sync({ alter: true });
  console.log('Database synced');
};

module.exports = { sequelize, connectDB };