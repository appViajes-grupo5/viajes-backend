const Trip = require('../models/tripModel');

// --- GESTIÓN DE VIAJES (Código base optimizado) ---

async function getTrips(req, res) {
  try {
    const trips = await Trip.getAllTrips();
    res.json(trips);
  } catch (err) {
    console.error("Error en getTrips:", err);
    res.status(500).json({ error: 'Error obteniendo viajes' });
  }
}

async function getTrip(req, res) {
  try {
    const trip = await Trip.getTripById(req.params.id);
    if (!trip) return res.status(404).json({ error: 'Viaje no encontrado' });
    res.json(trip);
  } catch (err) {
    console.error("Error en getTrip:", err);
    res.status(500).json({ error: 'Error obteniendo viaje' });
  }
}

//crear nuevo viaje
async function createTrip(req, res) {
  try {
    // Nota: creator_id debería venir idealmente de req.user.id si usáis autenticación JWT
    const { creator_id, title, destination, start_date, end_date, estimated_cost, min_participants, transport_details, itinerary, } = req.body;

    // validación
    if (!creator_id || !title || !destination || !start_date || !end_date) {
      return res.status(400).json({ error: "Faltan campos obligatorios (creator_id, title, destination, fechas)" });
    }

    const newTripId = await Trip.crearTrip(req.body);
    res.status(201).json({ message: "Viaje creado", trip_id: newTripId });

  } catch (err) {
    console.error("Error en createTrip:", err);
    res.status(500).json({ error: "Error creando viaje" });
  }
}

//actualizar viaje
async function updateTrip(req, res) {
  try {
    const tripId = req.params.id;
    const data = req.body;

    // validación
    if (!data || Object.keys(data).length === 0) {
      return res.status(400).json({ error: "No se han recibido datos para actualizar" });
    }

    // Eliminamos campos que no deberían actualizarse manualmente si vienen en el body
    delete data.created_at; 
    delete data.trip_id;

    const actualizado = await Trip.updateTrip(tripId, data);

    if (!actualizado) {
      return res.status(404).json({ error: "Viaje no encontrado o no se realizaron cambios" });
    }

    res.json({ message: "Viaje actualizado correctamente" });

  } catch (err) {
    console.error("Error en updateTrip:", err);
    res.status(500).json({ error: "Error al actualizar viaje" });
  }
}

//borrar viaje
async function deleteTrip(req, res) {
  try {
    const tripId = req.params.id;
    const borrado = await Trip.deleteTrip(tripId);

    if (!borrado) {
      return res.status(404).json({ error: "Viaje no encontrado" });
    }

    res.json({ message: "Viaje eliminado correctamente" });

  } catch (err) {
    console.error("Error en deleteTrip:", err); 
    res.status(500).json({ error: "Error al eliminar viaje" });
  }
}

// --- CRUD PARTICIPANTES ---

// 1. Unirse a un viaje
async function joinTrip(req, res) {
  const { tripId } = req.params;
  const { userId } = req.body;

  if (!userId) return res.status(400).json({ error: "Falta userId" });

  try {
    const existing = await Trip.getParticipant(tripId, userId);
    if (existing) {
      return res.status(409).json({ error: 'Ya has solicitado unirte a este viaje' });
    }

    await Trip.addParticipant(tripId, userId);
    res.status(201).json({ message: 'Solicitud enviada correctamente' });
  } catch (err) {
    console.error("Error en joinTrip:", err);
    res.status(500).json({ error: 'Error al unirse al viaje' });
  }
}

// 2. Ver participantes
async function getTripParticipants(req, res) {
  try {
    const participants = await Trip.getParticipantsByTripId(req.params.tripId);
    res.json(participants);
  } catch (err) {
    console.error("Error en getTripParticipants:", err);
    res.status(500).json({ error: 'Error obteniendo participantes' });
  }
}

// 3. Actualizar estado (Aprobar/Rechazar)
async function updateParticipantStatus(req, res) {
  const { tripId } = req.params;
  const { userId, status } = req.body; 

  if (!userId || !status) return res.status(400).json({ error: "Faltan datos (userId, status)" });

  try {
    await Trip.updateParticipantStatus(tripId, userId, status);
    res.json({ message: `Participante ${status} correctamente` });
  } catch (err) {
    console.error("Error en updateParticipantStatus:", err);
    res.status(500).json({ error: 'Error actualizando estado' });
  }
}

// 4. Salir del viaje
async function leaveTrip(req, res) {
  const { tripId } = req.params;
  const { userId } = req.body;

  if (!userId) return res.status(400).json({ error: "Falta userId" });

  try {
    await Trip.removeParticipant(tripId, userId);
    res.json({ message: 'Has salido del viaje correctamente' });
  } catch (err) {
    console.error("Error en leaveTrip:", err);
    res.status(500).json({ error: 'Error al salir del viaje' });
  }
}

module.exports = { 
  getTrips, 
  getTrip, 
  createTrip, 
  updateTrip, 
  deleteTrip,
  joinTrip, 
  getTripParticipants, 
  updateParticipantStatus, 
  leaveTrip 
};