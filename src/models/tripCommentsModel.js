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
    `SELECT tc.comment_id, tc.trip_id, tc.user_id, tc.comment_text, tc.created_at,
            u.first_name, u.last_name, u.profile_picture_url
     FROM trip_comments tc
     JOIN users u ON tc.user_id = u.user_id
     WHERE tc.comment_id = ?`,
    [commentId]
  );
  return rows[0] || null;
}

async function getCommentsByTrip(tripId) {
  const [rows] = await pool.query(
    `SELECT tc.comment_id, tc.trip_id, tc.user_id, tc.comment_text, tc.created_at,
            u.first_name, u.last_name, u.profile_picture_url
     FROM trip_comments tc
     JOIN users u ON tc.user_id = u.user_id
     WHERE tc.trip_id = ? 
     ORDER BY tc.created_at ASC`,
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
