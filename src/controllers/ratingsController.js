const {
  createRating,
  getRatingById,
  getRatingsByUser,
  getRatingsByTrip
} = require('../models/ratingsModel');

const { getTripById } = require('../models/tripsModel');
const { getParticipant } = require('../models/participantModel');

//crear valoración POST – requiere auth
async function createRatingController(req, res) {
  try {
    const userId = req.user?.id; // viene del authMiddleware
    const { trip_id, rated_user_id, rating_value, comment } = req.body;

          // asegurar que rating_value es número
    const numericRating = Number(rating_value);
    if (isNaN(numericRating)) {
      return res.status(400).json({
      error: "La valoración debe ser un número"
     });
    }

      // evitar que un usuario se valore a símismo
    if (Number(rated_user_id) === Number(userId)) {
      return res.status(400).json({
       error: "No puedes valorarte a ti mismo"
      });
    }

 
    if (!trip_id || !rated_user_id || !rating_value) {
      return res.status(400).json({
        error: "Faltan campos obligatorios"
      });
    }
        // validar rango de valoración
    if (numericRating < 1 || numericRating > 5) {

      return res.status(400).json({
        error: "La valoración debe estar entre 1 y 5"
      });
      }

      // Comprobar que el viaje existe
    const trip = await getTripById(trip_id);
    if (!trip) {
      return res.status(404).json({
     error: "El viaje indicado no existe"
      });
    }

    // comprobar que el creador de la valoración participó en el viaje
    const rater = await getParticipant(trip_id, userId);
    if (!rater || rater.status !== 'approved') {
      return res.status(400).json({
        error: "Solo puedes valorar a usuarios que participaron contigo en el viaje"
      });
    }

    // comprobar que el usuario valorado también participó en el viaje
    const rated = await getParticipant(trip_id, rated_user_id);
    if (!rated || rated.status !== 'approved') {
      return res.status(400).json({
        error: "No puedes valorar a un usuario que no participó en este viaje"
      });
    }

    //crear valoración
    const newRatingId = await createRating({
      trip_id,
      rater_user_id: userId,
      rated_user_id,
      rating_value:numericRating,
      comment
    });

    return res.status(201).json({
      message: "Valoración creada correctamente",
      rating_id: newRatingId
    });

  } catch (err) {
    console.error("Error en createRatingController:", err);
    return res.status(500).json({ error: "Error creando valoración" });
  }
}



//obtener valoración por ID
async function getRating(req, res) {
  try {
    const ratingId = req.params.id;
    const rating = await getRatingById(ratingId);

    if (!rating) {
      return res.status(404).json({ error: "Valoración no encontrada" });
    }

    return res.json(rating);

  } catch (err) {
    console.error("Error en getRating:", err);
    return res.status(500).json({ error: "Error obteniendo valoración" });
  }
}



//valoraciones recibidas por usuario
async function getRatingsForUser(req, res) {
  try {
    const userId = req.params.userId;
    const ratings = await getRatingsByUser(userId);
    return res.json(ratings);

  } catch (err) {
    console.error("Error en getRatingsForUser:", err);
    return res.status(500).json({ error: "Error obteniendo valoraciones de usuario" });
  }
}



//valoraciones de un viaje
async function getRatingsForTrip(req, res) {
  try {
    const tripId = req.params.tripId;
    const ratings = await getRatingsByTrip(tripId);
    return res.json(ratings);

  } catch (err) {
    console.error("Error en getRatingsForTrip:", err);
    return res.status(500).json({ error: "Error obteniendo valoraciones del viaje" });
  }
}


module.exports = {
  createRatingController,
  getRating,
  getRatingsForUser,
  getRatingsForTrip
};
