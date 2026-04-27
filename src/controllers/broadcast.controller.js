const { getLiveContent } = require('../services/broadcast.service');
const { successResponse, errorResponse } = require('../utils/response.util');

const getLive = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const { subject } = req.query;

    if (!teacherId || isNaN(teacherId)) {
      return errorResponse(res, 400, 'Invalid teacher ID');
    }

    const content = await getLiveContent(parseInt(teacherId), subject || null);

    if (!content) {
      return successResponse(res, 200, 'No content available', null);
    }

    return successResponse(res, 200, 'Live content fetched', content);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

module.exports = { getLive };