const { pool } = require('../config/db');

// Helper: Verificar si ya existe
async function getParticipant(tripId, userId) {
  const [rows] = await pool.query(
    'SELECT * FROM trip_participants WHERE trip_id = ? AND user_id = ?',
    [tripId, userId]
  );
  return rows[0];
}

// CREATE: Unirse
async function addParticipant(tripId, userId) {
  const [result] = await pool.query(
    "INSERT INTO trip_participants (trip_id, user_id, status) VALUES (?, ?, 'pending')",
    [tripId, userId]
  );
  return result;
}

// READ: Ver participantes
async function getParticipantsByTripId(tripId) {
  const [rows] = await pool.query(
    `SELECT tp.participant_id, tp.status, u.user_id, u.first_name, u.last_name, u.profile_picture_url
     FROM trip_participants tp
     JOIN users u ON tp.user_id = u.user_id
     WHERE tp.trip_id = ?`,
    [tripId]
  );
  return rows;
}

// UPDATE: Cambiar estado
async function updateParticipantStatus(tripId, userId, status) {
  const [result] = await pool.query(
    'UPDATE trip_participants SET status = ? WHERE trip_id = ? AND user_id = ?',
    [status, tripId, userId]
  );
  return result;
}

// DELETE: Salir
async function removeParticipant(tripId, userId) {
  const [result] = await pool.query(
    'DELETE FROM trip_participants WHERE trip_id = ? AND user_id = ?',
    [tripId, userId]
  );
  return result;
}

module.exports = {
  getParticipant,
  addParticipant,
  getParticipantsByTripId,
  updateParticipantStatus,
  removeParticipant
};