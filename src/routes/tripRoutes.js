const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');

router.get('/', tripController.getTrips);
router.get('/:id', tripController.getTrip);

//  exportar el router directamente
module.exports = router;
