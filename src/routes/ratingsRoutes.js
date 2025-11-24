const express = require('express');
const router = express.Router();

const {
  createRatingController,
  getRating,
  getRatingsForUser,
  getRatingsForTrip
} = require('../controllers/ratingsController');

//POST requiere autenticación
const authMiddleware = require('../middleware/authMiddleware');

//Crear valoración
router.post('/', authMiddleware, createRatingController);

//Obtener una valoración por ID
router.get('/:id', getRating);

//Obtener valoraciones recibidas por un usuario
router.get('/user/:userId', getRatingsForUser);

//Obtener valoraciones asociadas a un viaje
router.get('/trip/:tripId', getRatingsForTrip);

module.exports = router;
