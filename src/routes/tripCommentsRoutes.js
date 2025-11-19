const express = require('express');
const router = express.Router();
const tripCommentsController = require('../controllers/tripCommentsController');

router.get('/:trip_id', tripCommentsController.list);

router.post('/', tripCommentsController.create);

router.put('/:comment_id', tripCommentsController.update);

router.delete('/:comment_id', tripCommentsController.remove);

module.exports = router;
