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

module.exports = {
  crearTrip,
  getTripById,
  getAllTrips,
  getTripsByUser,
  updateTrip,
  deleteTrip,
};
