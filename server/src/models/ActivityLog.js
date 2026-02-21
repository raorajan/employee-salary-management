const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  message: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('ActivityLog', activityLogSchema);
