const User = require('../models/User');
const Outpass = require('../models/Outpass');
const Complaint = require('../models/Complaint');
const Announcement = require('../models/Announcement');
const generateToken = require('../utils/generateToken');

const ADMIN_EMAIL = 'admin@gmail.com';

const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  department: user.department,
  course: user.course,
  registerNo: user.registerNo,
  blockNo: user.blockNo,
  roomNo: user.roomNo,
  address: user.address,
  mobile: user.mobile,
  parentMobile: user.parentMobile,
  createdAt: user.createdAt
});

const register = async (req, res) => {
  const {
    name,
    email,
    password,
    department,
    course,
    registerNo,
    blockNo,
    roomNo,
    address,
    mobile,
    parentMobile
  } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    return res.status(409).json({ success: false, message: 'User already exists with this email' });
  }

  if (email.toLowerCase() === ADMIN_EMAIL) {
    return res.status(403).json({
      success: false,
      message: 'Admin access is managed by the system. Please use login for the admin account.'
    });
  }

  const role = email.toLowerCase() === ADMIN_EMAIL ? 'admin' : 'student';

  const user = await User.create({
    name,
    email,
    password,
    role,
    department,
    course,
    registerNo,
    blockNo,
    roomNo,
    address,
    mobile,
    parentMobile
  });

  return res.status(201).json({
    success: true,
    message: 'Registration successful',
    token: generateToken(user._id),
    user: sanitizeUser(user)
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  return res.json({
    success: true,
    message: 'Login successful',
    token: generateToken(user._id),
    user: sanitizeUser(user)
  });
};

const getProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  return res.json(user);
};

const updateProfile = async (req, res) => {
  const fields = [
    'name',
    'department',
    'course',
    'registerNo',
    'blockNo',
    'roomNo',
    'address',
    'mobile',
    'parentMobile'
  ];

  const user = await User.findById(req.user._id);
  fields.forEach((field) => {
    if (req.body[field] !== undefined) {
      user[field] = req.body[field];
    }
  });

  if (req.body.password) {
    user.password = req.body.password;
  }

  await user.save();

  return res.json({
    message: 'Profile updated successfully',
    user: sanitizeUser(user)
  });
};

const getStudentDashboard = async (req, res) => {
  const [outpasses, complaints] = await Promise.all([
    Outpass.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(5),
    Complaint.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(5)
  ]);
  const announcements = await Announcement.find({
    $or: [{ expiryDate: null }, { expiryDate: { $gte: new Date() } }]
  })
    .sort({ priority: -1, createdAt: -1 })
    .limit(5);

  const outpassCounts = await Outpass.aggregate([
    { $match: { userId: req.user._id } },
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);

  return res.json({
    success: true,
    user: req.user,
    recentOutpasses: outpasses,
    recentComplaints: complaints,
    outpassCounts,
    announcements
  });
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  getStudentDashboard
};
