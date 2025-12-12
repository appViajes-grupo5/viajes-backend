const express = require('express');
const router = express.Router();
const tripCommentsController = require('../controllers/tripCommentsController');
const { authMiddleware } = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.get('/:trip_id', tripCommentsController.list);

router.post('/', tripCommentsController.create);

router.put('/:comment_id', tripCommentsController.update);

router.delete('/:comment_id', tripCommentsController.remove);

module.exports = router;
