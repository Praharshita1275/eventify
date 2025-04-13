const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const { protect } = require('../middleware/auth');
const { checkRole } = require('../middleware/roleCheck');

// Event feedback routes
router.post('/event/:eventId', protect, feedbackController.createFeedback);
router.get('/event/:eventId', protect, feedbackController.getEventFeedback);

// User feedback routes
router.get('/user', protect, feedbackController.getUserFeedback);

// Admin routes
router.get('/', protect, checkRole('admin'), feedbackController.getAllFeedback);
router.put('/:id', protect, feedbackController.updateFeedback);
router.delete('/:id', protect, feedbackController.deleteFeedback);

module.exports = router;