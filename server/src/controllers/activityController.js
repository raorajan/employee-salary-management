const ActivityLog = require('../models/ActivityLog');

exports.list = async (req, res) => {
  try {
    const logs = await ActivityLog.find().sort({ createdAt: -1 }).limit(20);
    res.json(logs.map((l) => ({
      id: l._id.toString(),
      message: l.message,
      timestamp: l.createdAt,
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
