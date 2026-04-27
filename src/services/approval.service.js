const { Content, User } = require('../models/index');

const getPendingContent = async () => {
  return Content.findAll({
    where: { status: 'pending' },
    include: [{ association: 'uploader', attributes: ['id', 'name', 'email'] }],
    order: [['created_at', 'ASC']],
  });
};

const getAllContent = async () => {
  return Content.findAll({
    include: [{ association: 'uploader', attributes: ['id', 'name', 'email'] }],
    order: [['created_at', 'DESC']],
  });
};

const approveContent = async (contentId, principalId) => {
  const content = await Content.findByPk(contentId);
  if (!content) return null;

  await content.update({
    status: 'approved',
    approved_by: principalId,
    approved_at: new Date(),
    rejection_reason: null,
  });

  return content;
};

const rejectContent = async (contentId, principalId, reason) => {
  const content = await Content.findByPk(contentId);
  if (!content) return null;

  await content.update({
    status: 'rejected',
    approved_by: principalId,
    approved_at: new Date(),
    rejection_reason: reason,
  });

  return content;
};

module.exports = { getPendingContent, getAllContent, approveContent, rejectContent };