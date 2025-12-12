const Trip = require('../models/tripModel');

// GESTIÓN DE VIAJES

// Obtener todos los viajes
async function getTrips(req, res) {
  try {
    const trips = await Trip.getAllTrips();
    res.json(trips);
  } catch (err) {
    console.error('Error en getTrips:', err);
    res.status(500).json({ error: 'Error obteniendo viajes' });
  }
}

async function getMyTrips(req, res) {
  const user_id = req.user.id;
  console.log('user', user_id);
  try {
    const trips = await Trip.getTripsByUser(user_id);
    res.json(trips);
  } catch (err) {
    console.error('Error en getTrips:', err);
    res.status(500).json({ error: 'Error obteniendo viajes' });
  }
}

// Obtener un viaje
async function getTrip(req, res) {
  try {
    const trip = await Trip.getTripById(req.params.id);
    if (!trip) return res.status(404).json({ error: 'Viaje no encontrado' });
    res.json(trip);
  } catch (err) {
    console.error('Error en getTrip:', err);
    res.status(500).json({ error: 'Error obteniendo viaje' });
  }
}

//crear nuevo viaje
async function createTrip(req, res) {
  try {
    const creator_id = req.user.id; //ID del usuario q crea el viaje
    //datos enviados por el usuario
    const {
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

    //validación gral
    if (!title || !description || !destination || !start_date || !end_date) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    //validación fechas
    if (new Date(start_date) >= new Date(end_date)) {
      return res
        .status(400)
        .json({
          error: 'La fecha de inicio debe ser anterioor a la fecha de fin',
        });
    }

    //validación minim participantes
    if (min_participants !== undefined && min_participants < 1) {
      return res
        .status(400)
        .json({ error: 'El mínimo de participantes debe ser 1 o más' });
    }

    //validación coste estimado
    if (estimated_cost !== undefined && estimated_cost < 0) {
      return res
        .status(400)
        .json({ error: 'El coste estimado no puede ser negativo' });
    }

    //objeto final con todos los datos del viaje
    const tripData = {
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
    };
    const newTripId = await Trip.crearTrip(tripData);
    res.status(201).json({ message: 'Viaje creado', trip_id: newTripId });
  } catch (err) {
    console.error('Error en createTrip:', err);
    res.status(500).json({ error: 'Error creando viaje' });
  }
}

//actualizar viaje
async function updateTrip(req, res) {
  try {
    const tripId = req.params.id;
    const data = req.body;
    const trip = await Trip.getTripById(tripId);

    if (!trip) {
      return res.status(404).json({ error: 'Viaje no encontrado' });
    }

    //solo puede editarlo el creador
    if (trip.creator_id !== req.user.id) {
      return res
        .status(403)
        .json({ error: 'No tienes permiso para modificar este viaje' });
    }
    // validación
    if (!data || Object.keys(data).length === 0) {
      return res
        .status(400)
        .json({ error: 'No se han recibido datos para actualizar' });
    }

    // Eliminamos campos que no deberían actualizarse manualmente si vienen en el body
    delete data.created_at;
    delete data.trip_id;

    const actualizado = await Trip.updateTrip(tripId, data);

    if (!actualizado) {
      return res
        .status(404)
        .json({ error: 'Viaje no encontrado o no se realizaron cambios' });
    }

    res.json({ message: 'Viaje actualizado correctamente' });
  } catch (err) {
    console.error('Error en updateTrip:', err);
    res.status(500).json({ error: 'Error al actualizar viaje' });
  }
}

//borrar viaje
async function deleteTrip(req, res) {
  try {
    const tripId = req.params.id;
    const trip = await Trip.getTripById(tripId);

    if (!trip) {
      return res.status(404).json({ error: 'Viaje no encontrado' });
    }

    //solo puede borrarlo el creador
    if (trip.creator_id !== req.user.id) {
      return res
        .status(403)
        .json({ error: 'No tienes permiso para eliminar este viaje' });
    }

    const borrado = await Trip.deleteTrip(tripId);

    if (!borrado) {
      return res.status(404).json({ error: 'Viaje no encontrado' });
    }

    res.json({ message: 'Viaje eliminado correctamente' });
  } catch (err) {
    console.error('Error en deleteTrip:', err);
    res.status(500).json({ error: 'Error al eliminar viaje' });
  }
}

module.exports = {
  getTrips,
  getTrip,
  createTrip,
  updateTrip,
  deleteTrip,
  getMyTrips,
};
