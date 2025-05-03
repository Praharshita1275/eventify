const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { checkRole } = require('../middleware/roleCheck');
const announcementController = require('../controllers/announcementController');

// Public routes
router.get('/', announcementController.getAnnouncements);
router.get('/:id', announcementController.getAnnouncement);

// Protected admin routes
router.post('/', protect, checkRole('admin'), announcementController.createAnnouncement);
router.put('/:id', protect, checkRole('admin'), announcementController.updateAnnouncement);
router.delete('/:id', protect, checkRole('admin'), announcementController.deleteAnnouncement);

module.exports = router;