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

module.exports = { getTrips, getTrip };
