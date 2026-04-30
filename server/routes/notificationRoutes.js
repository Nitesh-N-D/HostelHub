const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  clearAllNotifications
} = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/', asyncHandler(getNotifications));
router.patch('/read-all', asyncHandler(markAllNotificationsRead));
router.delete('/clear-all', asyncHandler(clearAllNotifications));
router.patch('/:id/read', asyncHandler(markNotificationRead));

module.exports = router;
