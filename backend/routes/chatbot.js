const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/chatbotController');
const { protect } = require('../middleware/auth');

// Generate chatbot response
router.post('/chat', protect, chatbotController.generateResponse);

module.exports = router; 