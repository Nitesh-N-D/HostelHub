const User = require('../models/User');
const Notification = require('../models/Notification');
const { emitNotification } = require('./socket');

const createNotification = async ({ userId, title, message, type = 'system', link = '' }) => {
  if (!userId) return null;

  const notification = await Notification.create({
    userId,
    title,
    message,
    type,
    link
  });

  emitNotification(userId, notification);
  return notification;
};

const notifyAdmins = async ({ title, message, type = 'system', link = '' }) => {
  const admins = await User.find({ role: 'admin' }).select('_id');
  if (!admins.length) return [];

  const notifications = await Notification.insertMany(
    admins.map((admin) => ({
      userId: admin._id,
      title,
      message,
      type,
      link
    }))
  );

  notifications.forEach((notification) => emitNotification(notification.userId, notification));
  return notifications;
};

const notifyStudents = async ({ title, message, type = 'announcement', link = '' }) => {
  const students = await User.find({ role: 'student' }).select('_id');
  if (!students.length) return [];

  const notifications = await Notification.insertMany(
    students.map((student) => ({
      userId: student._id,
      title,
      message,
      type,
      link
    }))
  );

  notifications.forEach((notification) => emitNotification(notification.userId, notification));
  return notifications;
};

module.exports = {
  createNotification,
  notifyAdmins,
  notifyStudents
};
