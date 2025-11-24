const express = require('express');
const router = express.Router();

const {
  createRatingController,
  getRating,
  getRatingsForUser,
  getRatingsForTrip
} = require('../controllers/ratingsController');

const authMiddleware = require('../middlewares/authMiddleware');

// Crear valoración → requiere autenticación
router.post('/', authMiddleware, createRatingController);

// Obtener valoraciones recibidas por un usuario
router.get('/user/:userId', getRatingsForUser);

// Obtener valoraciones de un viaje
router.get('/trip/:tripId', getRatingsForTrip);

// Obtener valoración por ID
router.get('/:id', getRating);

module.exports = router;

