const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');
const { checkRole } = require('../middleware/roleCheck');

// Admin routes
router.get('/', authenticate, checkRole('admin'), userController.getAllUsers);
router.get('/:id', authenticate, checkRole('admin'), userController.getUserById);
router.put('/:id/role', authenticate, checkRole('admin'), userController.updateUserRole);
router.delete('/:id', authenticate, checkRole('admin'), userController.deleteUser);

// User profile routes
router.get('/profile', authenticate, userController.getUserProfile);
router.put('/profile', authenticate, userController.updateUserProfile);
router.put('/password', authenticate, userController.changePassword);
router.get('/events', authenticate, userController.getUserEvents);
router.get('/resources/bookmarked', authenticate, userController.getBookmarkedResources);

module.exports = router;