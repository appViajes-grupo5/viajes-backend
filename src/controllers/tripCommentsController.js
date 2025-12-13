const TripComments = require('../models/tripCommentsModel');
const Participant = require('../models/participantModel');
const Trip = require('../models/tripModel');

async function create(req, res) {
  const { trip_id, comment_text } = req.body;
  const user_id = req.user.id; 

  if (!trip_id || !comment_text) {
    return res.status(400).json({ error: 'trip_id y comment_text son requeridos' });
  }

  try {
    const trip = await Trip.getTripById(trip_id);
    if (!trip) {
      return res.status(404).json({ error: 'Viaje no encontrado' });
    }

    const isCreator = trip.creator_id === user_id;
    const participant = await Participant.getParticipant(trip_id, user_id);
    const isApproved = participant && (participant.status === 'approved' || participant.status === 'accepted');

    if (!isCreator && !isApproved) {
      return res.status(403).json({ error: 'Solo el creador y los participantes aceptados pueden comentar en este viaje' });
    }

    const commentId = await TripComments.createComment(trip_id, user_id, comment_text);
    const newComment = await TripComments.getCommentById(commentId);

    res.status(201).json(newComment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear el comentario' });
  }
}

async function list(req, res) {
  const { trip_id } = req.params;
  const user_id = req.user.id;

  try {
    const participant = await Participant.getParticipant(trip_id, user_id);
    const trip = await Trip.getTripById(trip_id);
    
    if (!trip) {
      return res.status(404).json({ error: 'Viaje no encontrado' });
    }

    const isCreator = trip.creator_id === user_id;
    const isApproved = participant && (participant.status === 'approved' || participant.status === 'accepted');

    if (!isCreator && !isApproved) {
      return res.status(403).json({ error: 'Solo los participantes aceptados pueden ver los comentarios' });
    }

    const comments = await TripComments.getCommentsByTrip(trip_id);
    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener comentarios' });
  }
}

async function update(req, res) {
  const { comment_id } = req.params;
  const { comment_text } = req.body;
  const user_id = req.user.id;

  if (!comment_text) {
    return res.status(400).json({ error: 'comment_text es requerido' });
  }

  try {
    const updated = await TripComments.updateComment(comment_id, user_id, comment_text);

    if (!updated) {
      return res.status(403).json({ error: 'No tienes permiso para editar este comentario o no existe' });
    }

    const updatedComment = await TripComments.getCommentById(comment_id);
    res.json(updatedComment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar comentario' });
  }
}

async function remove(req, res) {
  const { comment_id } = req.params;
  const user_id = req.user.id;

  try {
    const deleted = await TripComments.deleteComment(comment_id, user_id);

    if (!deleted) {
      return res.status(403).json({ error: 'No tienes permiso para eliminar este comentario o no existe' });
    }

    res.json({ message: 'Comentario eliminado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar comentario' });
  }
}

module.exports = {
  create,
  list,
  update,
  remove
};
