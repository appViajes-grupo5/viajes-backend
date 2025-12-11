const express = require('express');
const router = express.Router();
const forumController = require('../controllers/forumController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// Públicas (o privadas según preferencias)
router.get('/', forumController.getTopics);
router.get('/:id', forumController.getTopicDetail);

// Protegidas
router.post('/', authMiddleware, forumController.createTopic);
router.post('/:id/reply', authMiddleware, forumController.replyToTopic);

module.exports = router;