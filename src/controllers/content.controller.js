const { uploadContent, getTeacherContent, getContentById } = require('../services/content.service');
const { successResponse, errorResponse } = require('../utils/response.util');

/**
 * POST /api/content/upload
 * Teacher uploads new content
 */
const upload = async (req, res) => {
  try {
    // File is attached by multer middleware
    if (!req.file) {
      return errorResponse(res, 400, 'File is required');
    }

    const { title, subject, description, start_time, end_time, rotation_duration } = req.body;

    if (!title || !subject) {
      return errorResponse(res, 400, 'Title and subject are required');
    }

    // Validate time window if provided
    if (start_time && end_time) {
      const start = new Date(start_time);
      const end = new Date(end_time);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return errorResponse(res, 400, 'Invalid date format for start_time or end_time');
      }

      if (end <= start) {
        return errorResponse(res, 400, 'end_time must be after start_time');
      }
    }

    // Validate rotation duration if provided
    if (rotation_duration && (isNaN(rotation_duration) || parseInt(rotation_duration) < 1)) {
      return errorResponse(res, 400, 'rotation_duration must be a positive number (in minutes)');
    }

    const content = await uploadContent({
      title,
      description,
      subject,
      file: req.file,
      uploadedBy: req.user.id,
      startTime: start_time || null,
      endTime: end_time || null,
      rotationDuration: rotation_duration ? parseInt(rotation_duration) : 5,
    });

    return successResponse(res, 201, 'Content uploaded successfully. Awaiting principal approval.', {
      id: content.id,
      title: content.title,
      subject: content.subject,
      status: content.status,
      file_url: content.file_url,
      start_time: content.start_time,
      end_time: content.end_time,
    });
  } catch (error) {
    // Handle multer errors (file size, file type)
    if (error.code === 'LIMIT_FILE_SIZE') {
      return errorResponse(res, 400, 'File size exceeds 10MB limit');
    }
    return errorResponse(res, error.status || 500, error.message);
  }
};

/**
 * GET /api/content/my
 * Teacher views their own uploaded content
 */
const getMyContent = async (req, res) => {
  try {
    const content = await getTeacherContent(req.user.id);
    return successResponse(res, 200, 'Content fetched successfully', content);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

/**
 * GET /api/content/:id
 * Get single content item details
 */
const getOne = async (req, res) => {
  try {
    const content = await getContentById(req.params.id);

    if (!content) {
      return errorResponse(res, 404, 'Content not found');
    }

    // Teacher can only view their own content
    if (req.user.role === 'teacher' && content.uploaded_by !== req.user.id) {
      return errorResponse(res, 403, 'Access denied');
    }

    return successResponse(res, 200, 'Content fetched successfully', content);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

module.exports = { upload, getMyContent, getOne };