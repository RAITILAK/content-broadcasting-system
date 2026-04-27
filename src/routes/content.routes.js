const express = require('express');
const router = express.Router();
const { upload, getMyContent, getOne } = require('../controllers/content.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const uploadMiddleware = require('../middlewares/upload.middleware');

/**
 * @route   POST /api/content/upload
 * @desc    Teacher uploads content
 * @access  Teacher only
 */


// Custom multer error handler wrapper
const handleUpload = (req, res, next) => {
      console.log('Content-Type header:', req.headers['content-type']); // ← add this

  uploadMiddleware.single('file')(req, res, (err) => {
    if (err) {
              console.log('Multer error:', err); // ← add this too

      return res.status(400).json({ success: false, message: err.message });
    }
    next();
  });
};
router.post(
  '/upload',
  authenticate,
  authorize('teacher'),
  handleUpload,
  upload
);

/**
 * @route   GET /api/content/my
 * @desc    Teacher views their uploaded content
 * @access  Teacher only
 */
router.get(
  '/my',
  authenticate,
  authorize('teacher'),
  getMyContent
);

/**
 * @route   GET /api/content/:id
 * @desc    Get single content details
 * @access  Teacher (own content) / Principal (any)
 */
router.get(
  '/:id',
  authenticate,
  authorize('teacher', 'principal'),
  getOne
);

module.exports = router;