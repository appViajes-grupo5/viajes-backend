const Trip = require('../models/tripModel');

// ==========================================
// GESTIÓN DE VIAJES
// ==========================================

// ------------------------------------------
// Obtener todos los viajes
// ------------------------------------------
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

// ------------------------------------------
// Obtener un viaje por ID
// ------------------------------------------
async function getTrip(req, res) {
  try {
    const trip = await Trip.getTripById(req.params.id);
    if (!trip) {
      return res.status(404).json({ error: 'Viaje no encontrado' });
    }
    res.json(trip);
  } catch (err) {
    console.error('Error en getTrip:', err);
    res.status(500).json({ error: 'Error obteniendo viaje' });
  }
}

// ------------------------------------------
// Crear nuevo viaje
// ------------------------------------------
async function createTrip(req, res) {
  try {
    const creator_id = req.user.id; // ID del usuario autenticado (viene del token)

    // NOTA: Asumimos que la validación de datos (fechas, campos obligatorios, etc.)
    // ya ha sido realizada por el middleware de Zod antes de llegar aquí.
    
    // Construimos el objeto final
    const tripData = {
      creator_id,
      ...req.body // Esparcimos los datos ya validados y limpios del body
    };

    const newTripId = await Trip.crearTrip(tripData);
    
    res.status(201).json({ 
      message: "Viaje creado exitosamente", 
      trip_id: newTripId 
    });

  } catch (err) {
    console.error('Error en createTrip:', err);
    res.status(500).json({ error: 'Error creando viaje' });
  }
}

// ------------------------------------------
// Actualizar viaje
// ------------------------------------------
async function updateTrip(req, res) {
  try {
    const tripId = req.params.id;
    const data = req.body;
    
    // 1. Verificar que el viaje existe
    const trip = await Trip.getTripById(tripId);

    if (!trip) {
      return res.status(404).json({ error: 'Viaje no encontrado' });
    }

    // 2. Verificar permisos (Solo el creador puede editar)
    if (trip.creator_id !== req.user.id) {
      return res
        .status(403)
        .json({ error: 'No tienes permiso para modificar este viaje' });
    }

    // 3. Limpieza de datos (Seguridad)
    // Eliminamos campos que no deben modificarse manualmente
    delete data.created_at;
    delete data.trip_id;
    delete data.creator_id; // Importante: evita que se traspase la propiedad del viaje

    // 4. Actualizar en BD
    const actualizado = await Trip.updateTrip(tripId, data);

    if (!actualizado) {
      return res.status(404).json({ error: "No se realizaron cambios o error en BD" });
    }

    res.json({ message: 'Viaje actualizado correctamente' });
  } catch (err) {
    console.error('Error en updateTrip:', err);
    res.status(500).json({ error: 'Error al actualizar viaje' });
  }
}

// ------------------------------------------
// Borrar viaje
// ------------------------------------------
async function deleteTrip(req, res) {
  try {
    const tripId = req.params.id;
    
    // 1. Verificar que el viaje existe
    const trip = await Trip.getTripById(tripId);

    if (!trip) {
      return res.status(404).json({ error: 'Viaje no encontrado' });
    }

    // 2. Verificar permisos (Solo el creador puede borrar)
    if (trip.creator_id !== req.user.id) {
      return res
        .status(403)
        .json({ error: 'No tienes permiso para eliminar este viaje' });
    }

    // 3. Borrar de la BD
    const borrado = await Trip.deleteTrip(tripId);

    if (!borrado) {
      return res.status(404).json({ error: "No se pudo eliminar el viaje" });
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
