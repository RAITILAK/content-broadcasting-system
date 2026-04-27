const { getPendingContent, approveContent, rejectContent, getAllContent } = require('../services/approval.service');
const { successResponse, errorResponse } = require('../utils/response.util');

const listPending = async (req, res) => {
  try {
    const content = await getPendingContent();
    return successResponse(res, 200, 'Pending content fetched', content);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

const listAll = async (req, res) => {
  try {
    const content = await getAllContent();
    return successResponse(res, 200, 'All content fetched', content);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

const approve = async (req, res) => {
  try {
    const content = await approveContent(req.params.id, req.user.id);
    if (!content) return errorResponse(res, 404, 'Content not found');
    return successResponse(res, 200, 'Content approved successfully', content);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

const reject = async (req, res) => {
  try {
    const { rejection_reason } = req.body;
    if (!rejection_reason || !rejection_reason.trim()) {
      return errorResponse(res, 400, 'Rejection reason is required');
    }
    const content = await rejectContent(req.params.id, req.user.id, rejection_reason);
    if (!content) return errorResponse(res, 404, 'Content not found');
    return successResponse(res, 200, 'Content rejected', content);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

module.exports = { listPending, listAll, approve, reject };