const express = require('express');
const router = express.Router();
const forumController = require('../controllers/forumController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Públicas (o privadas según preferencias)
router.get('/', forumController.getTopics);
router.get('/:id', forumController.getTopicDetail);

// Protegidas
router.post('/', authenticateToken, forumController.createTopic);
router.post('/:id/reply', authenticateToken, forumController.replyToTopic);

module.exports = router;