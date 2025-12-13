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
    'SELECT user_id, email, first_name, last_name, phone, bio, interests, profile_picture_url, average_rating, created_at, confirmed FROM users WHERE user_id = ?',
    [userId]
  );
  return rows[0] || null;
}

async function getUserByEmail(email) {
  const [rows] = await pool.query(
    'SELECT user_id, email, password_hash, first_name, last_name, phone, bio, interests, profile_picture_url, average_rating, created_at, confirmed FROM users WHERE email = ?',
    [email]
  );
  return rows[0] || null;
}

/**
 * Confirma la cuenta de un usuario
 * @param {number} userId - ID del usuario
 */
async function confirmUser(userId) {
  await pool.query(
    'UPDATE users SET confirmed = 1 WHERE user_id = ?',
    [userId]
  );
  return await getUserById(userId);
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

async function updateAverageRating(userId) {
  const [rows] = await pool.query(
    `SELECT AVG(rating_value) as avg_rating
     FROM ratings
     WHERE rated_user_id = ?`,
    [userId]
  );
  
  const avgRating = rows[0].avg_rating ? parseFloat(rows[0].avg_rating).toFixed(2) : 0.00;
  
  await pool.query(
    'UPDATE users SET average_rating = ? WHERE user_id = ?',
    [avgRating, userId]
  );
  
  return avgRating;
}

async function setResetToken(userId, token, expiresAt) {
  await pool.query(
    'UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE user_id = ?',
    [token, expiresAt, userId]
  );
}

async function getUserByResetToken(token) {
  const [rows] = await pool.query(
    'SELECT user_id, email, first_name, last_name, reset_token_expires FROM users WHERE reset_token = ?',
    [token]
  );
  return rows[0] || null;
}

async function updatePassword(userId, passwordHash) {
  await pool.query(
    'UPDATE users SET password_hash = ?, reset_token = NULL, reset_token_expires = NULL WHERE user_id = ?',
    [passwordHash, userId]
  );
}

module.exports = {
  crearUsuario,
  getUserByEmail,
  getUserById,
  updateUser,
  confirmUser,
  updateAverageRating,
  setResetToken,
  getUserByResetToken,
  updatePassword
};