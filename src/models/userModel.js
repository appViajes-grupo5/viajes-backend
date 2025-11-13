const { pool } = require('../config/db');

async function crearUsuario(email, password_hash, first_name, last_name, bio, interests, profile_picture_url, average_rating) {
  const [result] = await pool.query(
    'INSERT INTO users (email, password_hash, first_name, last_name, bio, interests, profile_picture_url, average_rating) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [email, password_hash, first_name, last_name, bio, interests, profile_picture_url, average_rating]
  );
  return result.insertId;
}   