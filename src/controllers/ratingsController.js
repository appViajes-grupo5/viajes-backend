const {
  createRating,
  getRatingById,
  getRatingsByUser,
  getRatingsByTrip
} = require('../models/ratingsModel');


//crear valoración POST – requiere auth
async function createRatingController(req, res) {
  try {
    const userId = req.user?.id; // viene del authMiddleware
    const { trip_id, rated_user_id, rating_value, comment } = req.body;

 
    if (!trip_id || !rated_user_id || !rating_value) {
      return res.status(400).json({
        error: "Faltan campos obligatorios"
      });
    }
        // validar rango de valoración
    if (rating_value < 1 || rating_value > 5) {
      return res.status(400).json({
        error: "La valoración debe estar entre 1 y 5"
      });
      }

    //crear valoracion
    const newRatingId = await createRating({
      trip_id,
      rater_user_id: userId,
      rated_user_id,
      rating_value,
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
