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
    'SELECT user_id, email, first_name, last_name, bio, interests, profile_picture_url, average_rating FROM users WHERE user_id = ?',
    [userId]
  );
  return rows[0] || null;
}

async function getUserByEmail(email) {
  const [rows] = await pool.query(
    'SELECT user_id, email, password_hash, first_name, last_name, bio, interests, profile_picture_url, average_rating FROM users WHERE email = ?',
    [email]
  );
  return rows[0] || null;
}

module.exports = {
  crearUsuario,
  getUserByEmail,
  getUserById
};