const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement
} = require('../controllers/announcementController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/', asyncHandler(getAnnouncements));
router.post('/', authorize('admin'), asyncHandler(createAnnouncement));
router.patch('/:id', authorize('admin'), asyncHandler(updateAnnouncement));
router.delete('/:id', authorize('admin'), asyncHandler(deleteAnnouncement));

module.exports = router;
