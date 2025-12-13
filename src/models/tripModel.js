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
const [result] = await pool.query(
    `INSERT INTO trips 
      (creator_id, title, description, destination, start_date, end_date, estimated_cost, min_participants, transport_details, itinerary)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      creator_id,
      title,
      description,
      destination,
      start_date,
      end_date,
      estimated_cost,
      min_participants,
      transport_details,
      itinerary,
    ]
  );

  return result.insertId;
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

  const trip = rows[0];
  if (!trip) return null;

  // Obtener datos del creador, INCLUYENDO contacto (email, phone)
  // En el frontend se decidirá si mostrarlos basándose en si el usuario está aceptado.
  const [creatorRows] = await pool.query(
    `SELECT first_name, last_name, email, phone, profile_picture_url 
     FROM users 
     WHERE user_id = ?`,
    [trip.creator_id]
  );

  if (creatorRows.length > 0) {
    trip.creator_first_name = creatorRows[0].first_name;
    trip.creator_last_name = creatorRows[0].last_name;
    trip.creator_email = creatorRows[0].email;
    trip.creator_phone = creatorRows[0].phone;
    trip.creator_avatar = creatorRows[0].profile_picture_url;
  }

  //contar participantes aprobados
  const [countRows] = await pool.query(
    `SELECT COUNT(*) AS participant_count
     FROM trip_participants
     WHERE trip_id = ? AND status = 'approved'`,
    [tripId]
  );

  trip.participant_count = countRows[0].participant_count || 0;

  return trip;;
}

async function getAllTrips(filters = {}, page = 1, limit = 20) {
  const offset = (page - 1) * limit;
  const conditions = [];
  const values = [];

  if (filters.destination) {
    conditions.push('destination LIKE ?');
    values.push(`%${filters.destination}%`);
  }

  if (filters.startDateFrom) {
    conditions.push('start_date >= ?');
    values.push(filters.startDateFrom);
  }

  if (filters.startDateTo) {
    conditions.push('start_date <= ?');
    values.push(filters.startDateTo);
  }

  if (filters.endDateFrom) {
    conditions.push('end_date >= ?');
    values.push(filters.endDateFrom);
  }

  if (filters.endDateTo) {
    conditions.push('end_date <= ?');
    values.push(filters.endDateTo);
  }

  if (filters.minCost !== undefined && filters.minCost !== null) {
    conditions.push('estimated_cost >= ?');
    values.push(filters.minCost);
  }

  if (filters.maxCost !== undefined && filters.maxCost !== null) {
    conditions.push('estimated_cost <= ?');
    values.push(filters.maxCost);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  
  let orderBy = 'ORDER BY created_at DESC';
  if (filters.sortBy) {
    const sortOrder = filters.sortOrder === 'asc' ? 'ASC' : 'DESC';
    const validSorts = {
      'date': 'start_date',
      'price': 'estimated_cost',
      'created': 'created_at',
      'destination': 'destination'
    };
    if (validSorts[filters.sortBy]) {
      orderBy = `ORDER BY ${validSorts[filters.sortBy]} ${sortOrder}`;
    }
  }

  const [rows] = await pool.query(
    `SELECT trip_id, creator_id, title, description, destination, start_date, end_date,
            estimated_cost, min_participants, transport_details, itinerary, created_at
     FROM trips
     ${whereClause}
     ${orderBy}
     LIMIT ? OFFSET ?`,
    [...values, limit, offset]
  );

  const [countRows] = await pool.query(
    `SELECT COUNT(*) as total
     FROM trips
     ${whereClause}`,
    values
  );

  return {
    trips: rows,
    total: countRows[0].total,
    page,
    limit,
    totalPages: Math.ceil(countRows[0].total / limit)
  };
}

async function getTripsByUser(userId, filters = {}, page = 1, limit = 20) {
  const offset = (page - 1) * limit;
  const conditions = ['creator_id = ?'];
  const values = [userId];

  if (filters.destination) {
    conditions.push('destination LIKE ?');
    values.push(`%${filters.destination}%`);
  }

  if (filters.startDateFrom) {
    conditions.push('start_date >= ?');
    values.push(filters.startDateFrom);
  }

  if (filters.startDateTo) {
    conditions.push('start_date <= ?');
    values.push(filters.startDateTo);
  }

  if (filters.endDateFrom) {
    conditions.push('end_date >= ?');
    values.push(filters.endDateFrom);
  }

  if (filters.endDateTo) {
    conditions.push('end_date <= ?');
    values.push(filters.endDateTo);
  }

  if (filters.minCost !== undefined && filters.minCost !== null) {
    conditions.push('estimated_cost >= ?');
    values.push(filters.minCost);
  }

  if (filters.maxCost !== undefined && filters.maxCost !== null) {
    conditions.push('estimated_cost <= ?');
    values.push(filters.maxCost);
  }

  const whereClause = `WHERE ${conditions.join(' AND ')}`;
  
  let orderBy = 'ORDER BY created_at DESC';
  if (filters.sortBy) {
    const sortOrder = filters.sortOrder === 'asc' ? 'ASC' : 'DESC';
    const validSorts = {
      'date': 'start_date',
      'price': 'estimated_cost',
      'created': 'created_at',
      'destination': 'destination'
    };
    if (validSorts[filters.sortBy]) {
      orderBy = `ORDER BY ${validSorts[filters.sortBy]} ${sortOrder}`;
    }
  }

  const [rows] = await pool.query(
    `SELECT trip_id, creator_id, title, description, destination, start_date, end_date,
            estimated_cost, min_participants, transport_details, itinerary, created_at
     FROM trips
     ${whereClause}
     ${orderBy}
     LIMIT ? OFFSET ?`,
    [...values, limit, offset]
  );

  const [countRows] = await pool.query(
    `SELECT COUNT(*) as total
     FROM trips
     ${whereClause}`,
    values
  );

  return {
    trips: rows,
    total: countRows[0].total,
    page,
    limit,
    totalPages: Math.ceil(countRows[0].total / limit)
  };
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

  return result.affectedRows > 0;
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
  deleteTrip
};