const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const {
  createOutpass,
  getOutpasses,
  updateOutpassStatus,
  downloadOutpassPdf
} = require('../controllers/outpassController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.route('/').post(asyncHandler(createOutpass)).get(asyncHandler(getOutpasses));
router.patch('/:id/status', authorize('admin'), asyncHandler(updateOutpassStatus));
router.get('/:id/pdf', asyncHandler(downloadOutpassPdf));

module.exports = router;
