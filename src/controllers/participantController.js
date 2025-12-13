const Participant = require('../models/participantModel');
const Trip = require('../models/tripModel');
const User = require('../models/userModel');
const { sendEmail } = require('../services/emailService');
const Notifications = require('../models/notificationsModel');

// 1. Unirse a un viaje
async function joinTrip(req, res) {
  const { tripId } = req.body;
  const userId = req.user.id; // ¡SEGURO! Viene del token, no del body

  if (!tripId) return res.status(400).json({ error: "Faltan datos (tripId)" });

  try {
    const trip = await Trip.getTripById(tripId);
    if (!trip) {
      return res.status(404).json({ error: 'Viaje no encontrado' });
    }

    if (trip.creator_id === userId) {
      return res.status(400).json({ error: 'Eres el creador del viaje, ya estás dentro.' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = new Date(trip.start_date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(trip.end_date);
    endDate.setHours(0, 0, 0, 0);

    if (today >= startDate) {
      return res.status(400).json({ 
        error: 'No puedes unirte a un viaje que ya ha comenzado' 
      });
    }

    if (today > endDate) {
      return res.status(400).json({ 
        error: 'No puedes unirte a un viaje que ya ha finalizado' 
      });
    }

    const existing = await Participant.getParticipant(tripId, userId);
    if (existing) {
      return res.status(409).json({ error: 'Ya has solicitado unirte a este viaje' });
    }

    await Participant.addParticipant(tripId, userId);
    
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:4200';
    const requester = await User.getUserById(userId);
    const requesterName = `${requester.first_name} ${requester.last_name || ''}`.trim();
    const creator = await User.getUserById(trip.creator_id);
    
    try {
      await Notifications.createNotification(
        trip.creator_id,
        `${requesterName} ha solicitado unirse a tu viaje "${trip.title}"`,
        `${frontendUrl}/viaje/${tripId}`
      );
    } catch (err) {
      console.error('Error creando notificación:', err);
    }

    try {
      if (creator && creator.email) {
        await sendEmail(
          creator.email,
          `Nueva solicitud para tu viaje "${trip.title}"`,
          `Hola ${creator.first_name},\n\n${requesterName} ha solicitado unirse a tu viaje "${trip.title}". Entra en la app para revisar y gestionar la solicitud.\n\n${frontendUrl}/viaje/${tripId}`
        );
      }
    } catch (err) {
      console.error('Error enviando email al creador:', err);
    }
    
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

// 3. Actualizar estado (Solo el CREADOR del viaje puede hacer esto)
async function updateParticipantStatus(req, res) {
  // targetUserId es el usuario al que vamos a aceptar/rechazar
  const { tripId, userId: targetUserId, status } = req.body;
  const requesterId = req.user.id; // El usuario que intenta hacer la acción debe ser el creador

  if (!tripId || !targetUserId || !status) {
    return res.status(400).json({ error: "Faltan datos (tripId, userId, status)" });
  }

  // Validar estados permitidos
  const validStatuses = ['approved', 'rejected', 'pending'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: "Estado no válido" });
  }

  try {
    // 1. Buscar el viaje para ver quién es el creador
    const trip = await Trip.getTripById(tripId);
    if (!trip) {
      return res.status(404).json({ error: "Viaje no encontrado" });
    }

    // 2. Comprobar permisos
    if (trip.creator_id !== requesterId) {
      return res.status(403).json({ error: "No tienes permiso para gestionar participantes en este viaje" });
    }

    // 3. Ejecutar actualización
    await Participant.updateParticipantStatus(tripId, targetUserId, status);

    // 4. ENVÍO DE EMAIL Y NOTIFICACIÓN
    if (status === 'approved') {
      try {
        const participantUser = await User.getUserById(targetUserId);

        if (participantUser && participantUser.email) {
          const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:4200';
          
          await sendEmail(
            participantUser.email,
            '¡Has sido aceptado en un viaje!',
            `Hola ${participantUser.first_name}, el creador del viaje "${trip.title}" ha aceptado tu solicitud. Entra en la app para ver los detalles y contactar con el grupo.`
          );

          await Notifications.createNotification(
            targetUserId,
            `Has sido aceptado en el viaje "${trip.title}"`,
            `${frontendUrl}/viaje/${tripId}`
          );
        }
      } catch (err) {
        console.error("Error enviando notificación de aceptación:", err);
      }
    } else if (status === 'rejected') {
      try {
        const participantUser = await User.getUserById(targetUserId);
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:4200';

        if (participantUser) {
          await Notifications.createNotification(
            targetUserId,
            `Tu solicitud para el viaje "${trip.title}" ha sido rechazada`,
            `${frontendUrl}/viajes`
          );

          if (participantUser.email) {
            await sendEmail(
              participantUser.email,
              `Solicitud rechazada - Viaje "${trip.title}"`,
              `Hola ${participantUser.first_name},\n\nLamentamos informarte que tu solicitud para unirte al viaje "${trip.title}" ha sido rechazada.\n\nPuedes explorar otros viajes disponibles en la plataforma.\n\n${frontendUrl}/viajes`
            );
          }
        }
      } catch (err) {
        console.error("Error en notificación de rechazo:", err);
      }
    }

    res.json({ message: `Participante ${status} correctamente` });

  } catch (err) {
    console.error("Error en updateParticipantStatus:", err);
    res.status(500).json({ error: 'Error actualizando estado' });
  }
}

// 4. Salir
async function leaveTrip(req, res) {
  const { tripId } = req.body;
  const userId = req.user.id; // ¡SEGURO! Viene del token

  if (!tripId) return res.status(400).json({ error: "Faltan datos (tripId)" });

  try {
    // Verificar que el viaje existe y no ha finalizado
    const trip = await Trip.getTripById(tripId);
    if (!trip) {
      return res.status(404).json({ error: 'Viaje no encontrado' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = new Date(trip.start_date);
    startDate.setHours(0, 0, 0, 0);

    // No permitir salir si el viaje ya comenzó
    if (today >= startDate) {
      return res.status(400).json({ error: 'No puedes cancelar tu plaza porque el viaje ya comenzó o finalizó' });
    }

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