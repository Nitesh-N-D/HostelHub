const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const {
  createComplaint,
  getComplaints,
  updateComplaintStatus,
  deleteComplaint
} = require('../controllers/complaintController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.route('/').post(asyncHandler(createComplaint)).get(asyncHandler(getComplaints));
router.patch('/:id/status', authorize('admin'), asyncHandler(updateComplaintStatus));
router.delete('/:id', authorize('admin'), asyncHandler(deleteComplaint));

module.exports = router;
