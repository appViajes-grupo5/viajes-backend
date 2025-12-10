const express = require('express');
const router = express.Router();
const participantController = require('../controllers/participantController');
// Importamos el middleware de autenticación
const { authMiddleware } = require('../middlewares/authMiddleware'); 

// Rutas CRUD para participantes

// Todas las rutas protegidas con authenticateToken
// POST /api/participants/join (Unirse a un viaje)
router.post('/join', authMiddleware, participantController.joinTrip);

// GET /api/participants/trip/:tripId (Ver lista de un viaje)
// Nota: Podrías dejarla pública si quieres que cualquiera vea quién va, pero el PDF sugiere proteger todo.
router.get('/trip/:tripId', authMiddleware, participantController.getTripParticipants);

// PUT /api/participants/status (Aceptar/Rechazar - Solo Creador)
router.put('/status', authMiddleware, participantController.updateParticipantStatus);

// DELETE /api/participants/leave (Salirse de un viaje)
router.delete('/leave', authMiddleware, participantController.leaveTrip);

module.exports = router;