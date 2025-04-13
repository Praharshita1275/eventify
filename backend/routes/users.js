const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { checkRole } = require('../middleware/roleCheck');

// Admin routes
router.get('/', protect, checkRole('admin'), userController.getUsers);
router.get('/:id', protect, checkRole('admin'), userController.getUser);
router.put('/:id', protect, checkRole('admin'), userController.updateUser);
router.delete('/:id', protect, checkRole('admin'), userController.deleteUser);

// User profile routes
router.get('/profile', protect, userController.getMe);
router.put('/profile', protect, userController.updateUser);
router.put('/password', protect, userController.updatePassword);

module.exports = router;