const Complaint = require('../models/Complaint');
const { createNotification, notifyAdmins } = require('../utils/notificationHelper');

const createComplaint = async (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({ success: false, message: 'Title and description are required' });
  }

  const complaint = await Complaint.create({
    userId: req.user._id,
    title,
    description
  });

  await notifyAdmins({
    title: 'New complaint raised',
    message: `${req.user.name} submitted a complaint: ${title}.`,
    type: 'complaint',
    link: '/complaints'
  });

  return res.status(201).json({
    success: true,
    message: 'Complaint submitted successfully',
    complaint
  });
};

const getComplaints = async (req, res) => {
  const complaints =
    req.user.role === 'admin'
      ? await Complaint.find().populate('userId', 'name email blockNo roomNo').sort({ createdAt: -1 })
      : await Complaint.find({ userId: req.user._id }).sort({ createdAt: -1 });

  return res.json({ success: true, complaints });
};

const updateComplaintStatus = async (req, res) => {
  const complaint = await Complaint.findById(req.params.id);
  if (!complaint) {
    return res.status(404).json({ success: false, message: 'Complaint not found' });
  }

  complaint.status = req.body.status || complaint.status;
  await complaint.save();
  await createNotification({
    userId: complaint.userId,
    title: 'Complaint updated',
    message: `Your complaint status is now ${complaint.status}.`,
    type: 'complaint',
    link: '/complaints'
  });

  return res.json({
    success: true,
    message: 'Complaint status updated successfully',
    complaint
  });
};

const deleteComplaint = async (req, res) => {
  const complaint = await Complaint.findById(req.params.id);
  if (!complaint) {
    return res.status(404).json({ success: false, message: 'Complaint not found' });
  }

  await complaint.deleteOne();
  return res.json({ success: true, message: 'Complaint deleted successfully' });
};

module.exports = {
  createComplaint,
  getComplaints,
  updateComplaintStatus,
  deleteComplaint
};
