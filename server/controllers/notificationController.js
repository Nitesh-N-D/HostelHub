const Notification = require('../models/Notification');

const getNotifications = async (req, res) => {
  const limitParam = Number(req.query.limit);
  const limit = Number.isFinite(limitParam) && limitParam > 0 ? Math.min(limitParam, 100) : 20;
  const notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(limit);
  const unreadCount = await Notification.countDocuments({ userId: req.user._id, isRead: false });

  return res.json({
    success: true,
    notifications,
    unreadCount
  });
};

const markNotificationRead = async (req, res) => {
  const notification = await Notification.findOne({ _id: req.params.id, userId: req.user._id });

  if (!notification) {
    return res.status(404).json({ success: false, message: 'Notification not found' });
  }

  notification.isRead = true;
  await notification.save();

  return res.json({
    success: true,
    message: 'Notification marked as read'
  });
};

const markAllNotificationsRead = async (req, res) => {
  await Notification.updateMany({ userId: req.user._id, isRead: false }, { $set: { isRead: true } });

  return res.json({
    success: true,
    message: 'All notifications marked as read'
  });
};

const clearAllNotifications = async (req, res) => {
  await Notification.deleteMany({ userId: req.user._id });

  return res.json({
    success: true,
    message: 'All notifications cleared'
  });
};

module.exports = {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  clearAllNotifications
};
