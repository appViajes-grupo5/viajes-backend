const { pool } = require('../config/db');

async function createComment(trip_id, user_id, comment_text) {
  const [result] = await pool.query(
    'INSERT INTO trip_comments (trip_id, user_id, comment_text) VALUES (?, ?, ?)',
    [trip_id, user_id, comment_text]
  );
  return result.insertId;
}

async function getCommentById(commentId) {
  const [rows] = await pool.query(
    'SELECT * FROM trip_comments WHERE comment_id = ?',
    [commentId]
  );
  return rows[0] || null;
}

async function getCommentsByTrip(tripId) {
  const [rows] = await pool.query(
    'SELECT * FROM trip_comments WHERE trip_id = ? ORDER BY created_at DESC',
    [tripId]
  );
  return rows;
}

async function updateComment(commentId, userId, comment_text) {
  const [result] = await pool.query(
    'UPDATE trip_comments SET comment_text = ? WHERE comment_id = ? AND user_id = ?',
    [comment_text, commentId, userId]
  );
  return result.affectedRows > 0;
}

async function deleteComment(commentId, userId) {
  const [result] = await pool.query(
    'DELETE FROM trip_comments WHERE comment_id = ? AND user_id = ?',
    [commentId, userId]
  );
  return result.affectedRows > 0;
}

module.exports = {
  createComment,
  getCommentById,
  getCommentsByTrip,
  updateComment,
  deleteComment
};
