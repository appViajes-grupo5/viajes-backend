const Trip = require('../models/tripModel');

async function getTrips(req, res) {
  try {
    const trips = await Trip.getAllTrips();
    res.json(trips);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error obteniendo viajes' });
  }
}

async function getTrip(req, res) {
  try {
    const trip = await Trip.getTripById(req.params.id);
    if (!trip) return res.status(404).json({ error: 'Viaje no encontrado' });
    res.json(trip);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error obteniendo viaje' });
  }
}

//crear nuevo viaje
async function createTrip(req, res) {
  try {
    const {
      creator_id,
      title,
      description,
      destination,
      start_date,
      end_date,
      estimated_cost,
      min_participants,
      transport_details,
      itinerary,
    } = req.body;

    // validacion
    if (!creator_id || !title || !description || !destination || !start_date || !end_date) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const newTripId = await Trip.crearTrip({
      creator_id,
      title,
      description,
      destination,
      start_date,
      end_date,
      estimated_cost,
      min_participants,
      transport_details,
      itinerary,
    });

    res.status(201).json({ message: "Viaje creado", trip_id: newTripId });

  } catch (err) {
    console.error("Error al crear viaje:", err);
    res.status(500).json({ error: "Error creando viaje" });
  }
}

module.exports = { getTrips, getTrip, createTrip };
