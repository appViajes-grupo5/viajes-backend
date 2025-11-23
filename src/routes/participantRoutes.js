const express = require('express');
const router = express.Router();
const participantController = require('../controllers/participantController');

// Rutas CRUD para participantes

// POST /api/participants/join  (Body: { tripId, userId })
router.post('/join', participantController.joinTrip);

// GET /api/participants/trip/:tripId (Para ver lista de un viaje)
router.get('/trip/:tripId', participantController.getTripParticipants);

// PUT /api/participants/status (Body: { tripId, userId, status })
router.put('/status', participantController.updateParticipantStatus);

// DELETE /api/participants/leave (Body: { tripId, userId })
router.delete('/leave', participantController.leaveTrip);

module.exports = router;