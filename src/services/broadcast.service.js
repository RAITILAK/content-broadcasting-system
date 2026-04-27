const { Content, ContentSchedule, ContentSlot } = require('../models/index');
const { Op } = require('sequelize');
const { getCurrentContent } = require('../utils/schedule.util');

/**
 * Returns the currently active content for a teacher
 * Optional: filter by subject
 */
const getLiveContent = async (teacherId, subject = null) => {
  // Build slot filter
  const slotWhere = { teacher_id: teacherId };
  if (subject) slotWhere.subject = subject.toLowerCase().trim();

  // Find all relevant slots for this teacher
  const slots = await ContentSlot.findAll({ where: slotWhere });

  if (!slots.length) return null;

  const slotIds = slots.map((s) => s.id);
  const now = new Date();

  // Get all approved schedules for these slots with content in active time window
  const schedules = await ContentSchedule.findAll({
    where: { slot_id: { [Op.in]: slotIds } },
    include: [
      {
        model: Content,
        as: 'content',
        where: {
          status: 'approved',
          uploaded_by: teacherId,
          start_time: { [Op.lte]: now },
          end_time: { [Op.gte]: now },
        },
        required: true,
      },
    ],
    order: [['rotation_order', 'ASC']],
  });

  if (!schedules.length) return null;

  // If subject filter — single rotation
  if (subject) {
    return getCurrentContent(schedules, now);
  }

  // No subject filter — return active content per subject
  const bySubject = {};
  for (const schedule of schedules) {
    const sub = schedule.content.subject;
    if (!bySubject[sub]) bySubject[sub] = [];
    bySubject[sub].push(schedule);
  }

  const results = {};
  for (const [sub, subSchedules] of Object.entries(bySubject)) {
    const active = getCurrentContent(subSchedules, now);
    if (active) results[sub] = active;
  }

  return Object.keys(results).length ? results : null;
};

module.exports = { getLiveContent };