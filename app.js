const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const YAML = require('yamljs');
const swaggerUi = require('swagger-ui-express');

const app = express();

// Security & parsing middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Swagger docs
const swaggerDocument = YAML.load('./docs/swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes (will be added as we build each module)
app.use('/api/auth', require('./src/routes/auth.routes'));
app.use('/api/content', require('./src/routes/content.routes'));
app.use('/api/approval', require('./src/routes/approval.routes'));
app.use('/content', require('./src/routes/broadcast.routes'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

module.exports = app;