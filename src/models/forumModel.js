const { pool } = require('../config/db');

// --- TOPICS (HILOS) ---

async function createTopic(userId, title, content, category = 'General') {
  const [result] = await pool.query(
    'INSERT INTO forum_topics (user_id, title, content, category) VALUES (?, ?, ?, ?)',
    [userId, title, content, category]
  );
  return result.insertId;
}

async function getAllTopics() {
  // Obtenemos temas + datos del creador + conteo de respuestas
  const query = `
    SELECT t.*, u.first_name, u.last_name, u.profile_picture_url,
    (SELECT COUNT(*) FROM forum_replies r WHERE r.topic_id = t.topic_id) as reply_count
    FROM forum_topics t
    JOIN users u ON t.user_id = u.user_id
    ORDER BY t.created_at DESC
  `;
  const [rows] = await pool.query(query);
  return rows;
}

async function getTopicById(topicId) {
  const [rows] = await pool.query(
    `SELECT t.*, u.first_name, u.last_name, u.profile_picture_url 
     FROM forum_topics t
     JOIN users u ON t.user_id = u.user_id
     WHERE t.topic_id = ?`,
    [topicId]
  );
  return rows[0];
}

// --- REPLIES (RESPUESTAS) ---

async function createReply(topicId, userId, text) {
  const [result] = await pool.query(
    'INSERT INTO forum_replies (topic_id, user_id, reply_text) VALUES (?, ?, ?)',
    [topicId, userId, text]
  );
  return result.insertId;
}

async function getRepliesByTopic(topicId) {
  const [rows] = await pool.query(
    `SELECT r.*, u.first_name, u.last_name, u.profile_picture_url
     FROM forum_replies r
     JOIN users u ON r.user_id = u.user_id
     WHERE r.topic_id = ?
     ORDER BY r.created_at ASC`,
    [topicId]
  );
  return rows;
}

module.exports = {
  createTopic, getAllTopics, getTopicById,
  createReply, getRepliesByTopic
};