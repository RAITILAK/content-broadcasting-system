const express = require('express');
const router = express.Router();
const { getLive } = require('../controllers/broadcast.controller');

// Public endpoint — no auth required
// Optional ?subject=maths filter
router.get('/live/:teacherId', getLive);

module.exports = router;