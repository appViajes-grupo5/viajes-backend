const Participant = require('../models/participantModel');

// 1. Unirse a un viaje
async function joinTrip(req, res) {
  const { tripId, userId } = req.body; // OJO: Ahora tripId viene en el body si cambiamos la ruta

  if (!tripId || !userId) return res.status(400).json({ error: "Faltan datos" });

  try {
    const existing = await Participant.getParticipant(tripId, userId);
    if (existing) {
      return res.status(409).json({ error: 'Ya has solicitado unirte a este viaje' });
    }

    await Participant.addParticipant(tripId, userId);
    res.status(201).json({ message: 'Solicitud enviada correctamente' });
  } catch (err) {
    console.error("Error en joinTrip:", err);
    res.status(500).json({ error: 'Error al unirse al viaje' });
  }
}

// 2. Ver participantes
async function getTripParticipants(req, res) {
  const { tripId } = req.params;
  try {
    const participants = await Participant.getParticipantsByTripId(tripId);
    res.json(participants);
  } catch (err) {
    console.error("Error en getTripParticipants:", err);
    res.status(500).json({ error: 'Error obteniendo participantes' });
  }
}

// 3. Actualizar estado
async function updateParticipantStatus(req, res) {
  const { tripId, userId, status } = req.body; 

  if (!tripId || !userId || !status) return res.status(400).json({ error: "Faltan datos" });

  try {
    await Participant.updateParticipantStatus(tripId, userId, status);
    res.json({ message: `Participante ${status} correctamente` });
  } catch (err) {
    console.error("Error en updateParticipantStatus:", err);
    res.status(500).json({ error: 'Error actualizando estado' });
  }
}

// 4. Salir
async function leaveTrip(req, res) {
  const { tripId, userId } = req.body;

  if (!tripId || !userId) return res.status(400).json({ error: "Faltan datos" });

  try {
    await Participant.removeParticipant(tripId, userId);
    res.json({ message: 'Has salido del viaje correctamente' });
  } catch (err) {
    console.error("Error en leaveTrip:", err);
    res.status(500).json({ error: 'Error al salir del viaje' });
  }
}

module.exports = {
  joinTrip,
  getTripParticipants,
  updateParticipantStatus,
  leaveTrip
};