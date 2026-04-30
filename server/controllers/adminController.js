const Outpass = require('../models/Outpass');
const Complaint = require('../models/Complaint');
const User = require('../models/User');
const Announcement = require('../models/Announcement');

const getAdminStats = async (_req, res) => {
  const now = new Date();
  const [
    outpassStatus,
    complaintStatus,
    studentsPerBlock,
    monthlyOutpassTrends,
    totalUsers,
    activeAnnouncements,
    recentOutpasses,
    recentComplaints
  ] =
    await Promise.all([
      Outpass.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Complaint.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      User.aggregate([
        { $match: { role: 'student' } },
        { $group: { _id: '$blockNo', count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ]),
      Outpass.aggregate([
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
      ]),
      User.countDocuments({ role: 'student' }),
      Announcement.countDocuments({
        $or: [{ expiryDate: null }, { expiryDate: { $gte: now } }]
      }),
      Outpass.find()
        .populate('userId', 'name registerNo blockNo roomNo department')
        .sort({ createdAt: -1 })
        .limit(5),
      Complaint.find()
        .populate('userId', 'name blockNo roomNo')
        .sort({ createdAt: -1 })
        .limit(5)
    ]);

  res.json({
    success: true,
    summary: {
      totalStudents: totalUsers,
      totalOutpasses: outpassStatus.reduce((sum, item) => sum + item.count, 0),
      totalComplaints: complaintStatus.reduce((sum, item) => sum + item.count, 0),
      activeAnnouncements
    },
    outpassStatus,
    complaintStatus,
    studentsPerBlock,
    monthlyOutpassTrends,
    recentOutpasses,
    recentComplaints
  });
};

module.exports = {
  getAdminStats
};
