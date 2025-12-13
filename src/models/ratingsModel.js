const { pool } = require('../config/db');

//crear valoración
async function createRating({ trip_id, rater_user_id, rated_user_id, rating_value, comment = null }) {
  try {
    const [result] = await pool.query(
      `INSERT INTO ratings 
        (trip_id, rater_user_id, rated_user_id, rating_value, comment)
        VALUES (?, ?, ?, ?, ?)`,
      [trip_id, rater_user_id, rated_user_id, rating_value, comment]
    );

    return result.insertId;

  } catch (err) {
    console.error("ERROR EN createRating:", err);
    throw err;
  }
}

//obtener valoración por ID
async function getRatingById(ratingId) {
  const [rows] = await pool.query(
    `SELECT rating_id, trip_id, rater_user_id, rated_user_id, rating_value, comment, created_at
     FROM ratings
     WHERE rating_id = ?`,
    [ratingId]
  );

  return rows[0] || null;
}

async function getRatingsByUser(userId) {
  const [rows] = await pool.query(
    `SELECT 
      r.rating_id, 
      r.trip_id, 
      r.rater_user_id, 
      r.rated_user_id, 
      r.rating_value, 
      r.comment, 
      r.created_at,
      rater.first_name as rater_first_name,
      rater.last_name as rater_last_name,
      rater.profile_picture_url as rater_profile_picture_url,
      trip.title as trip_title,
      trip.destination as trip_destination
     FROM ratings r
     LEFT JOIN users rater ON r.rater_user_id = rater.user_id
     LEFT JOIN trips trip ON r.trip_id = trip.trip_id
     WHERE r.rated_user_id = ?
     ORDER BY r.created_at DESC`,
    [userId]
  );

  return rows;
}

//obtener valoraciones de un viaje
async function getRatingsByTrip(tripId) {
  const [rows] = await pool.query(
    `SELECT rating_id, trip_id, rater_user_id, rated_user_id, rating_value, comment, created_at
     FROM ratings
     WHERE trip_id = ?`,
    [tripId]
  );

  return rows;
}

async function getRatingByTripAndUsers(trip_id, rater_user_id, rated_user_id) {
  const [rows] = await pool.query(
    `SELECT rating_id
     FROM ratings
     WHERE trip_id = ? AND rater_user_id = ? AND rated_user_id = ?`,
    [trip_id, rater_user_id, rated_user_id]
  );

  return rows[0] || null;
}

module.exports = {
  createRating,
  getRatingById,
  getRatingsByUser,
  getRatingsByTrip,
  getRatingByTripAndUsers
};
