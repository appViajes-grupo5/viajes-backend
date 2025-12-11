const Participant = require('../models/participantModel');
const Trip = require('../models/tripModel');
// Nuevas importaciones para el envío de correos y obtención de datos de usuario
const User = require('../models/userModel');
const { sendEmail } = require('../services/emailService');

// 1. Unirse a un viaje
async function joinTrip(req, res) {
  const { tripId } = req.body;
  const userId = req.user.id; // ¡SEGURO! Viene del token, no del body

  if (!tripId) return res.status(400).json({ error: "Faltan datos (tripId)" });

  try {
    // Opcional: Verificar que el viaje existe antes de intentar unirse
    const trip = await Trip.getTripById(tripId);
    if (!trip) {
      return res.status(404).json({ error: 'Viaje no encontrado' });
    }

    // Verificar si el usuario es el creador (el creador no debería necesitar unirse a su propio viaje)
    if (trip.creator_id === userId) {
        return res.status(400).json({ error: 'Eres el creador del viaje, ya estás dentro.' });
    }

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

    // 4. ENVÍO DE EMAIL
    // Si el estado es 'approved', notificamos al usuario por correo
    if (status === 'approved') {
        try {
            const participantUser = await User.getUserById(targetUserId);
            
            // Verificamos que el usuario existe y tiene email
            if (participantUser && participantUser.email) {
                await sendEmail(
                    participantUser.email,
                    '¡Has sido aceptado en un viaje!',
                    `Hola ${participantUser.first_name}, el creador del viaje "${trip.title}" ha aceptado tu solicitud. Entra en la app para ver los detalles y contactar con el grupo.`
                );
            }
        } catch (emailErr) {
            // Solo logueamos el error del email para no fallar toda la petición http
            console.error("Error enviando email de aceptación:", emailErr);
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