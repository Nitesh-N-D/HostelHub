const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const { getAdminStats } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/stats', protect, authorize('admin'), asyncHandler(getAdminStats));

module.exports = router;
