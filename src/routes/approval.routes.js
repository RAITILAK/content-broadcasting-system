const express = require('express');
const router = express.Router();
const { listPending, listAll, approve, reject } = require('../controllers/approval.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

// All routes — principal only
router.get('/pending', authenticate, authorize('principal'), listPending);
router.get('/all', authenticate, authorize('principal'), listAll);
router.patch('/:id/approve', authenticate, authorize('principal'), approve);
router.patch('/:id/reject', authenticate, authorize('principal'), reject);

module.exports = router;