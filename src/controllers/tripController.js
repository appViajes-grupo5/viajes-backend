const Trip = require('../models/tripModel');
const Participant = require('../models/participantModel');
const Notifications = require('../models/notificationsModel');
const { sendEmail } = require('../services/emailService');

// ==========================================
// GESTIÓN DE VIAJES
// ==========================================

// ------------------------------------------
// Obtener todos los viajes
// ------------------------------------------
async function getTrips(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const filters = {
      destination: req.query.destination || null,
      startDateFrom: req.query.startDateFrom || null,
      startDateTo: req.query.startDateTo || null,
      endDateFrom: req.query.endDateFrom || null,
      endDateTo: req.query.endDateTo || null,
      minCost: req.query.minCost ? parseFloat(req.query.minCost) : null,
      maxCost: req.query.maxCost ? parseFloat(req.query.maxCost) : null,
      sortBy: req.query.sortBy || null,
      sortOrder: req.query.sortOrder || 'desc'
    };

    Object.keys(filters).forEach(key => {
      if (filters[key] === null || filters[key] === '') {
        delete filters[key];
      }
    });

    const result = await Trip.getAllTrips(filters, page, limit);
    res.json(result);
  } catch (err) {
    console.error('Error en getTrips:', err);
    res.status(500).json({ error: 'Error obteniendo viajes' });
  }
}

async function getMyTrips(req, res) {
  const user_id = req.user.id;
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const filters = {
      destination: req.query.destination || null,
      startDateFrom: req.query.startDateFrom || null,
      startDateTo: req.query.startDateTo || null,
      endDateFrom: req.query.endDateFrom || null,
      endDateTo: req.query.endDateTo || null,
      minCost: req.query.minCost ? parseFloat(req.query.minCost) : null,
      maxCost: req.query.maxCost ? parseFloat(req.query.maxCost) : null,
      sortBy: req.query.sortBy || null,
      sortOrder: req.query.sortOrder || 'desc'
    };

    Object.keys(filters).forEach(key => {
      if (filters[key] === null || filters[key] === '') {
        delete filters[key];
      }
    });

    const result = await Trip.getTripsByUser(user_id, filters, page, limit);
    res.json(result);
  } catch (err) {
    console.error('Error en getMyTrips:', err);
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
    const creator_id = req.user.id;

    if (req.body.start_date && req.body.end_date) {
      const startDate = new Date(req.body.start_date);
      const endDate = new Date(req.body.end_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (startDate >= endDate) {
        return res.status(400).json({
          error: 'La fecha de inicio debe ser anterior a la fecha de fin'
        });
      }

      if (endDate < today) {
        return res.status(400).json({
          error: 'No se pueden crear viajes con fecha de fin en el pasado'
        });
      }
    }

    // NOTA: Asumimos que la validación de datos (fechas, campos obligatorios, etc.)
    // ya ha sido realizada por el middleware de Zod antes de llegar aquí.

    // Construimos el objeto final
    const tripData = {
      creator_id,
      ...req.body
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
    if (Number(trip.creator_id) !== Number(req.user.id)) {
      return res.status(403).json({ error: "No tienes permiso para modificar este viaje" });
    }

    // 3. Validar fechas si se están actualizando
    if (data.start_date || data.end_date) {
      const startDate = new Date(data.start_date || trip.start_date);
      const endDate = new Date(data.end_date || trip.end_date);

      if (startDate >= endDate) {
        return res.status(400).json({
          error: 'La fecha de inicio debe ser anterior a la fecha de fin'
        });
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (endDate < today && trip.end_date !== data.end_date) {
        return res.status(400).json({
          error: 'No se puede cambiar la fecha de fin a una fecha pasada'
        });
      }
    }

    // 4. Limpieza de datos (Seguridad)
    delete data.created_at;
    delete data.trip_id;
    delete data.creator_id;

    // 4. Actualizar en BD
    const actualizado = await Trip.updateTrip(tripId, data);

    if (!actualizado) {
      return res.status(404).json({ error: "No se realizaron cambios o error en BD" });
    }

    // 5. Notificar a participantes aprobados si hay cambios importantes
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:4200';
    const hasDateChange = data.start_date || data.end_date;

    if (hasDateChange) {
      try {
        const participants = await Participant.getParticipantsByTripId(tripId);
        const approvedParticipants = participants.filter(p => p.status === 'approved');

        for (const participant of approvedParticipants) {
          if (participant.user_id !== req.user.id) {
            await Notifications.createNotification(
              participant.user_id,
              `El viaje "${trip.title}" ha sido actualizado`,
              `${frontendUrl}/viajes/${tripId}`
            );
          }
        }
      } catch (err) {
        console.error('Error notificando cambios en viaje:', err);
      }
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
    if (Number(trip.creator_id) !== Number(req.user.id)) {
      return res.status(403).json({ error: "No tienes permiso para eliminar este viaje" });
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
