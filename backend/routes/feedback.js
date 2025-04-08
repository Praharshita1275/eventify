const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const { authenticate } = require('../middleware/auth');
const { checkRole } = require('../middleware/roleCheck');

// User feedback routes
router.post('/', authenticate, feedbackController.submitFeedback);
router.get('/my-feedback', authenticate, feedbackController.getUserFeedback);

// Admin routes
router.get('/', authenticate, checkRole('admin'), feedbackController.getAllFeedback);
router.get('/:id', authenticate, checkRole('admin'), feedbackController.getFeedbackById);
router.put('/:id/status', authenticate, checkRole('admin'), feedbackController.updateFeedbackStatus);
router.delete('/:id', authenticate, checkRole('admin'), feedbackController.deleteFeedback);

module.exports = router;