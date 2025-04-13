const express = require('express');
const router = express.Router();
const resourceController = require('../controllers/resourceController');
const { protect } = require('../middleware/auth');
const { checkRole } = require('../middleware/roleCheck');

// Public routes
router.get('/', resourceController.getResources);
router.get('/:id', resourceController.getResource);
router.get('/:id/availability', resourceController.getResourceAvailability);

// Protected routes for admins
router.post('/', protect, checkRole('admin'), resourceController.createResource);
router.put('/:id', protect, checkRole('admin'), resourceController.updateResource);
router.delete('/:id', protect, checkRole('admin'), resourceController.deleteResource);

// Resource availability check
router.post('/check-availability', resourceController.checkResourceAvailability);

module.exports = router;