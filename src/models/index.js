const User = require('./User.model');
const Content = require('./Content.model');
const ContentSlot = require('./ContentSlot.model');
const ContentSchedule = require('./ContentSchedule.model');

// User → Content (teacher uploads many content items)
User.hasMany(Content, { foreignKey: 'uploaded_by', as: 'uploadedContent' });
Content.belongsTo(User, { foreignKey: 'uploaded_by', as: 'uploader' });

// User → Content (principal approves content)
User.hasMany(Content, { foreignKey: 'approved_by', as: 'approvedContent' });
Content.belongsTo(User, { foreignKey: 'approved_by', as: 'approver' });

// User → ContentSlot (teacher owns slots)
User.hasMany(ContentSlot, { foreignKey: 'teacher_id', as: 'slots' });
ContentSlot.belongsTo(User, { foreignKey: 'teacher_id', as: 'teacher' });

// ContentSlot → ContentSchedule
ContentSlot.hasMany(ContentSchedule, { foreignKey: 'slot_id', as: 'schedules' });
ContentSchedule.belongsTo(ContentSlot, { foreignKey: 'slot_id', as: 'slot' });

// Content → ContentSchedule
Content.hasOne(ContentSchedule, { foreignKey: 'content_id', as: 'schedule' });
ContentSchedule.belongsTo(Content, { foreignKey: 'content_id', as: 'content' });

module.exports = { User, Content, ContentSlot, ContentSchedule };