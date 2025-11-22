const { pool } = require('../config/db');

//nuevo viaje
async function crearTrip({
  creator_id,
  title,
  description,
  destination,
  start_date,
  end_date,
  estimated_cost = null,
  min_participants = 1,
  transport_details = null,
  itinerary = null,
}) {


  const fechaInicio = start_date;
  const fechaFin = end_date;


  const [result] = await pool.query(
    `INSERT INTO trips 
      (creator_id, title, description, destination, start_date, end_date, estimated_cost, min_participants, transport_details, itinerary)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      creator_id,
      title,
      description,
      destination,
      fechaInicio,
      fechaFin,
      estimated_cost,
      min_participants,
      transport_details,
      itinerary,
    ]
  );

  return result.insertId; //id del nuevo viaje
}

//devuelve viaje por su id
async function getTripById(tripId) {
  const [rows] = await pool.query(
    `SELECT trip_id, creator_id, title, description, destination, start_date, end_date,
            estimated_cost, min_participants, transport_details, itinerary, created_at
     FROM trips
     WHERE trip_id = ?`,
    [tripId]
  );

  return rows[0] || null;
}

//listar todos los viajes
async function getAllTrips() {
  const [rows] = await pool.query(
    `SELECT trip_id, creator_id, title, description, destination, start_date, end_date,
            estimated_cost, min_participants, transport_details, itinerary, created_at
     FROM trips`
  );
  return rows;
}

//viajes creados por un usuario
async function getTripsByUser(userId) {
  const [rows] = await pool.query(
    `SELECT trip_id, creator_id, title, description, destination, start_date, end_date,
            estimated_cost, min_participants, transport_details, itinerary, created_at
     FROM trips
     WHERE creator_id = ?`,
    [userId]
  );
  return rows;
}

//actualizar viaje por su id
async function updateTrip(tripId, data) {
  const fields = [];
  const values = [];

  for (const key in data) {
    fields.push(`${key} = ?`);
    values.push(data[key]);
  }


  const sql = `UPDATE trips SET ${fields.join(', ')} WHERE trip_id = ?`;
  values.push(tripId);

  const [result] = await pool.query(sql, values);

  return result.affectedRows > 0; //true si se actualizó
}

//borrar viaje
async function deleteTrip(tripId) {
  const [result] = await pool.query(
    `DELETE FROM trips WHERE trip_id = ?`,
    [tripId]
  );
  return result.affectedRows > 0;
}

// Helper: Verificar si usuario ya está en el viaje
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
    'INSERT INTO trip_participants (trip_id, user_id, status) VALUES (?, ?, "pending")',
    [tripId, userId]
  );
  return result;
}

// READ: Ver participantes (con datos de usuario)
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
  crearTrip,
  getTripById,
  getAllTrips,
  getTripsByUser,
  updateTrip,
  deleteTrip,
  getParticipant,
  addParticipant,
  getParticipantsByTripId,
  updateParticipantStatus,
  removeParticipant
};
