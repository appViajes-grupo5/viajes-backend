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

//obtener valoraciones recibidas por un usuario
async function getRatingsByUser(userId) {
  const [rows] = await pool.query(
    `SELECT rating_id, trip_id, rater_user_id, rated_user_id, rating_value, comment, created_at
     FROM ratings
     WHERE rated_user_id = ?`,
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

module.exports = {
  createRating,
  getRatingById,
  getRatingsByUser,
  getRatingsByTrip
};
