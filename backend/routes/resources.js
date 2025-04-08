const express = require('express');
const router = express.Router();
const resourceController = require('../controllers/resourceController');
const { authenticate } = require('../middleware/auth');
const { checkRole } = require('../middleware/roleCheck');

// Public routes
router.get('/', resourceController.getAllResources);
router.get('/:id', resourceController.getResourceById);
router.get('/category/:category', resourceController.getResourcesByCategory);

// Protected routes for admins and content creators
router.post('/', authenticate, checkRole('admin', 'content_creator'), resourceController.createResource);
router.put('/:id', authenticate, checkRole('admin', 'content_creator'), resourceController.updateResource);
router.delete('/:id', authenticate, checkRole('admin', 'content_creator'), resourceController.deleteResource);

// User interaction routes
router.post('/:id/bookmark', authenticate, resourceController.bookmarkResource);
router.delete('/:id/bookmark', authenticate, resourceController.removeBookmark);
router.post('/:id/rate', authenticate, resourceController.rateResource);

module.exports = router;