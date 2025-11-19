const { pool } = require('../config/db');

async function createNotification(user_id, message, link = null) {
  const [result] = await pool.query(
    'INSERT INTO notifications (user_id, message, link) VALUES (?, ?, ?)',
    [user_id, message, link]
  );
  return result.insertId;
}

async function getNotificationById(notification_id) {
  const [rows] = await pool.query(
    'SELECT * FROM notifications WHERE notification_id = ?',
    [notification_id]
  );
  return rows[0] || null;
}

async function getNotificationsByUser(user_id) {
  const [rows] = await pool.query(
    'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC',
    [user_id]
  );
  return rows;
}

async function markAsRead(notification_id) {
  const [result] = await pool.query(
    'UPDATE notifications SET is_read = 1 WHERE notification_id = ?',
    [notification_id]
  );
  return result.affectedRows > 0;
}

async function deleteNotification(notification_id) {
  const [result] = await pool.query(
    'DELETE FROM notifications WHERE notification_id = ?',
    [notification_id]
  );
  return result.affectedRows > 0;
}

module.exports = {
  createNotification,
  getNotificationById,
  getNotificationsByUser,
  markAsRead,
  deleteNotification
};
