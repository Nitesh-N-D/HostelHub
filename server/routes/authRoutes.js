const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const {
  register,
  login,
  getProfile,
  updateProfile,
  getStudentDashboard
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', asyncHandler(register));
router.post('/login', asyncHandler(login));
router.get('/profile', protect, asyncHandler(getProfile));
router.put('/profile', protect, asyncHandler(updateProfile));
router.get('/student-dashboard', protect, asyncHandler(getStudentDashboard));

module.exports = router;
