const Announcement = require('../models/Announcement');
const { notifyStudents } = require('../utils/notificationHelper');

const getAnnouncements = async (req, res) => {
  const now = new Date();
  const filter =
    req.user?.role === 'admin'
      ? {}
      : {
          $or: [{ expiryDate: null }, { expiryDate: { $gte: now } }]
        };

  const announcements = await Announcement.find(filter)
    .populate('createdBy', 'name email')
    .sort({ priority: -1, createdAt: -1 });

  res.json({
    success: true,
    announcements
  });
};

const createAnnouncement = async (req, res) => {
  const { title, description, priority, expiryDate } = req.body;

  if (!title || !description) {
    return res.status(400).json({
      success: false,
      message: 'Title and description are required'
    });
  }

  const announcement = await Announcement.create({
    title,
    description,
    priority: priority || 'normal',
    expiryDate: expiryDate || null,
    createdBy: req.user._id
  });

  const populated = await announcement.populate('createdBy', 'name email');
  await notifyStudents({
    title: `New announcement: ${announcement.title}`,
    message: announcement.description,
    type: 'announcement',
    link: '/announcements'
  });

  return res.status(201).json({
    success: true,
    message: 'Announcement created successfully',
    announcement: populated
  });
};

const updateAnnouncement = async (req, res) => {
  const { title, description, priority, expiryDate } = req.body;
  const announcement = await Announcement.findById(req.params.id);

  if (!announcement) {
    return res.status(404).json({
      success: false,
      message: 'Announcement not found'
    });
  }

  if (!title || !description) {
    return res.status(400).json({
      success: false,
      message: 'Title and description are required'
    });
  }

  announcement.title = title;
  announcement.description = description;
  announcement.priority = priority || 'normal';
  announcement.expiryDate = expiryDate || null;
  await announcement.save();

  const populated = await announcement.populate('createdBy', 'name email');

  return res.json({
    success: true,
    message: 'Announcement updated successfully',
    announcement: populated
  });
};

const deleteAnnouncement = async (req, res) => {
  const announcement = await Announcement.findById(req.params.id);

  if (!announcement) {
    return res.status(404).json({
      success: false,
      message: 'Announcement not found'
    });
  }

  await announcement.deleteOne();

  return res.json({
    success: true,
    message: 'Announcement deleted successfully'
  });
};

module.exports = {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement
};
