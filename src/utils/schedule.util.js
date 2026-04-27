/**
 * Determines which content is currently active for a given teacher+subject
 * based on rotation order and duration.
 *
 * Logic:
 * - Get all approved, scheduled, time-window-active content for teacher+subject
 * - Calculate total cycle length (sum of all durations in minutes)
 * - Use current time to find position within the cycle
 * - Return whichever content owns that position
 */
const getCurrentContent = (schedules, now = new Date()) => {
  if (!schedules || schedules.length === 0) return null;

  // Filter to only content within its active time window
  const active = schedules.filter((s) => {
    const content = s.content || s;
    const start = content.start_time ? new Date(content.start_time) : null;
    const end = content.end_time ? new Date(content.end_time) : null;

    // Must have both start and end time to be active
    if (!start || !end) return false;

    return now >= start && now <= end;
  });

  if (active.length === 0) return null;

  // Sort by rotation_order
  active.sort((a, b) => a.rotation_order - b.rotation_order);

  // Total cycle duration in milliseconds
  const totalCycleMs = active.reduce((sum, s) => sum + s.duration * 60 * 1000, 0);

  if (totalCycleMs === 0) return null;

  // Use a fixed epoch reference point for consistent rotation across all users
  const epochMs = now.getTime();
  const positionInCycle = epochMs % totalCycleMs;

  // Walk through rotation slots to find which content is active now
  let elapsed = 0;
  for (const schedule of active) {
    const slotDurationMs = schedule.duration * 60 * 1000;
    if (positionInCycle < elapsed + slotDurationMs) {
      return schedule.content || schedule;
    }
    elapsed += slotDurationMs;
  }

  return active[0].content || active[0];
};

module.exports = { getCurrentContent };