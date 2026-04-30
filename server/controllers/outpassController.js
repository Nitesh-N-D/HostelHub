const User = require('../models/User');
const Outpass = require('../models/Outpass');
const { createQrCodeDataUrl, streamOutpassPdf } = require('../utils/outpassDocument');
const { createNotification, notifyAdmins } = require('../utils/notificationHelper');

const createOutpass = async (req, res) => {
  const { fromDate, toDate, days, reason, destination } = req.body;

  if (!fromDate || !toDate || !days || !reason || !destination) {
    return res.status(400).json({ success: false, message: 'All outpass fields are required' });
  }

  const outpass = await Outpass.create({
    userId: req.user._id,
    fromDate,
    toDate,
    days,
    reason,
    destination
  });

  const populated = await outpass.populate('userId', 'name email registerNo department blockNo roomNo');
  await notifyAdmins({
    title: 'New outpass request',
    message: `${populated.userId.name} submitted a new outpass request.`,
    type: 'outpass',
    link: '/outpass'
  });
  return res.status(201).json({
    success: true,
    message: 'Outpass request submitted',
    outpass: populated
  });
};

const getOutpasses = async (req, res) => {
  const { blockNo, roomNo, department, status, search } = req.query;

  if (req.user.role === 'student') {
    const outpasses = await Outpass.find({ userId: req.user._id })
      .populate('userId', 'name email registerNo department blockNo roomNo')
      .sort({ createdAt: -1 });

    return res.json({ success: true, outpasses });
  }

  const userFilter = {};
  if (blockNo) userFilter.blockNo = blockNo;
  if (roomNo) userFilter.roomNo = roomNo;
  if (department) userFilter.department = department;

  const userQuery = {};
  if (Object.keys(userFilter).length > 0) {
    Object.assign(userQuery, userFilter);
  }
  if (search) {
    userQuery.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { registerNo: { $regex: search, $options: 'i' } }
    ];
  }

  let userIds = null;
  if (Object.keys(userQuery).length > 0) {
    const users = await User.find(userQuery).select('_id');
    userIds = users.map((user) => user._id);
  }

  const outpassFilter = {};
  if (status) outpassFilter.status = status;
  if (search) {
    const searchConditions = [
      { destination: { $regex: search, $options: 'i' } },
      { reason: { $regex: search, $options: 'i' } }
    ];

    if (userIds) {
      searchConditions.unshift({ userId: { $in: userIds } });
    }

    outpassFilter.$or = searchConditions;
  } else if (userIds) {
    outpassFilter.userId = { $in: userIds };
  }

  const outpasses = await Outpass.find(outpassFilter)
    .populate('userId', 'name email registerNo department blockNo roomNo course mobile')
    .sort({ createdAt: -1 });

  return res.json({ success: true, outpasses });
};

const updateOutpassStatus = async (req, res) => {
  const { status } = req.body;
  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status update' });
  }

  const outpass = await Outpass.findById(req.params.id).populate('userId');
  if (!outpass) {
    return res.status(404).json({ success: false, message: 'Outpass not found' });
  }

  outpass.status = status;

  if (status === 'approved') {
    outpass.qrCode = await createQrCodeDataUrl(outpass.userId, outpass);
  } else {
    outpass.qrCode = '';
  }

  await outpass.save();
  await createNotification({
    userId: outpass.userId._id,
    title: status === 'approved' ? 'Outpass approved' : 'Outpass rejected',
    message:
      status === 'approved'
        ? `Your outpass from ${new Date(outpass.fromDate).toLocaleDateString()} to ${new Date(outpass.toDate).toLocaleDateString()} was approved.`
        : `Your outpass from ${new Date(outpass.fromDate).toLocaleDateString()} to ${new Date(outpass.toDate).toLocaleDateString()} was rejected.`,
    type: 'outpass',
    link: '/outpass'
  });

  return res.json({
    success: true,
    message: `Outpass ${status} successfully`,
    outpass
  });
};

const downloadOutpassPdf = async (req, res) => {
  const outpass = await Outpass.findById(req.params.id).populate('userId');
  if (!outpass) {
    return res.status(404).json({ success: false, message: 'Outpass not found' });
  }

  const isOwner = outpass.userId._id.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'admin';

  if (!isOwner && !isAdmin) {
    return res.status(403).json({ success: false, message: 'Access denied for this PDF' });
  }

  if (outpass.status !== 'approved') {
    return res.status(400).json({ success: false, message: 'PDF is only available for approved outpasses' });
  }

  return streamOutpassPdf(res, outpass.userId, outpass);
};

module.exports = {
  createOutpass,
  getOutpasses,
  updateOutpassStatus,
  downloadOutpassPdf
};
