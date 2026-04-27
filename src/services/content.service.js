const { Content, ContentSlot, ContentSchedule } = require('../models/index');
const { Op } = require('sequelize');

/**
 * Upload new content — creates content record + slot + schedule entry
 */
const uploadContent = async ({ title, description, subject, file, uploadedBy, startTime, endTime, rotationDuration }) => {
  // Normalize subject to lowercase for consistency
  const normalizedSubject = subject.toLowerCase().trim();

  // Create the content record
  const content = await Content.create({
    title,
    description: description || null,
    subject: normalizedSubject,
    file_url: `/uploads/${file.filename}`,
    file_type: file.mimetype,
    file_size: file.size,
    uploaded_by: uploadedBy,
    status: 'pending',
    start_time: startTime || null,
    end_time: endTime || null,
  });

  // Find or create a content slot for this teacher + subject combination
  let [slot] = await ContentSlot.findOrCreate({
    where: { subject: normalizedSubject, teacher_id: uploadedBy },
    defaults: { subject: normalizedSubject, teacher_id: uploadedBy },
  });

  // Count existing schedules in this slot to determine rotation order
  const existingCount = await ContentSchedule.count({
    where: { slot_id: slot.id },
  });

  // Create schedule entry
  await ContentSchedule.create({
    content_id: content.id,
    slot_id: slot.id,
    rotation_order: existingCount + 1,
    duration: rotationDuration || 5, // default 5 minutes
  });

  return content;
};

/**
 * Get all content uploaded by a specific teacher
 */
const getTeacherContent = async (teacherId) => {
  const content = await Content.findAll({
    where: { uploaded_by: teacherId },
    include: [
      {
        association: 'schedule',
        attributes: ['rotation_order', 'duration'],
      },
    ],
    order: [['created_at', 'DESC']],
  });

  return content;
};

/**
 * Get a single content item by ID
 */
const getContentById = async (contentId) => {
  const content = await Content.findByPk(contentId, {
    include: [
      { association: 'uploader', attributes: ['id', 'name', 'email'] },
      { association: 'schedule', attributes: ['rotation_order', 'duration'] },
    ],
  });

  return content;
};

module.exports = { uploadContent, getTeacherContent, getContentById };