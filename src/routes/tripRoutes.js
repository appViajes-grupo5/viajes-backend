const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// Rutas públicas
router.get('/', tripController.getTrips);
router.get('/me', authMiddleware, tripController.getMyTrips);
router.get('/:id', tripController.getTrip);

// Rutas protegidas (user autenticado)
router.post('/', authMiddleware, tripController.createTrip);
router.put('/:id', authMiddleware, tripController.updateTrip);
router.delete('/:id', authMiddleware, tripController.deleteTrip);

module.exports = router;
