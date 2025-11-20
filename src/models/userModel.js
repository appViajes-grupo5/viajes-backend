const { pool } = require('../config/db');

async function crearUsuario(email, password_hash, first_name, last_name = null, bio = null, interests = null, profile_picture_url = null) {
  const [result] = await pool.query(
    'INSERT INTO users (email, password_hash, first_name, last_name, bio, interests, profile_picture_url) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [email, password_hash, first_name, last_name, bio, interests, profile_picture_url]
  );
  return result.insertId;
}

async function getUserById(userId) {
  const [rows] = await pool.query(
    'SELECT user_id, email, first_name, last_name, phone, bio, interests, profile_picture_url, average_rating, created_at FROM users WHERE user_id = ?',
    [userId]
  );
  return rows[0] || null;
}

async function getUserByEmail(email) {
  const [rows] = await pool.query(
    'SELECT user_id, email, password_hash, first_name, last_name, phone, bio, interests, profile_picture_url, average_rating, created_at FROM users WHERE email = ?',
    [email]
  );
  return rows[0] || null;
}

async function updateUser(userId, updateData) {
  const {
    first_name,
    last_name,
    phone,
    bio,
    interests,
    profile_picture_url
  } = updateData;

  // Construir la query dinámicamente solo con los campos que se envían
  // Solo se pueden editar: first_name, last_name, phone, bio, interests, profile_picture_url
  const fields = [];
  const values = [];

  if (first_name !== undefined) {
    fields.push('first_name = ?');
    values.push(first_name);
  }
  if (last_name !== undefined) {
    fields.push('last_name = ?');
    values.push(last_name);
  }
  if (phone !== undefined) {
    fields.push('phone = ?');
    values.push(phone);
  }
  if (bio !== undefined) {
    fields.push('bio = ?');
    values.push(bio);
  }
  if (interests !== undefined) {
    fields.push('interests = ?');
    values.push(interests);
  }
  if (profile_picture_url !== undefined) {
    fields.push('profile_picture_url = ?');
    values.push(profile_picture_url);
  }

  if (fields.length === 0) {
    throw new Error('No hay campos para actualizar');
  }

  values.push(userId);

  const query = `UPDATE users SET ${fields.join(', ')} WHERE user_id = ?`;
  
  await pool.query(query, values);
  
  // Retornar el usuario actualizado
  return await getUserById(userId);
}

module.exports = {
  crearUsuario,
  getUserByEmail,
  getUserById,
  updateUser
};