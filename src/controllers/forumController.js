const Forum = require('../models/forumModel');

// Listar temas
async function getTopics(req, res) {
  try {
    const topics = await Forum.getAllTopics();
    res.json(topics);
  } catch (err) {
    res.status(500).json({ error: 'Error cargando el foro' });
  }
}

// Crear nuevo tema
async function createTopic(req, res) {
  const { title, content, category } = req.body;
  const userId = req.user.id;

  if (!title || !content) return res.status(400).json({ error: 'Faltan datos' });

  try {
    const id = await Forum.createTopic(userId, title, content, category);
    res.status(201).json({ message: 'Tema creado', topicId: id });
  } catch (err) {
    res.status(500).json({ error: 'Error creando tema' });
  }
}

// Ver detalle de un tema (Tema + Respuestas)
async function getTopicDetail(req, res) {
  const { id } = req.params;
  try {
    const topic = await Forum.getTopicById(id);
    if (!topic) return res.status(404).json({ error: 'Tema no encontrado' });

    const replies = await Forum.getRepliesByTopic(id);
    
    res.json({ ...topic, replies }); // Devolvemos todo junto
  } catch (err) {
    res.status(500).json({ error: 'Error cargando detalle' });
  }
}

// Responder a un tema
async function replyToTopic(req, res) {
  const { id } = req.params; // topic_id
  const { text } = req.body;
  const userId = req.user.id;

  if (!text) return res.status(400).json({ error: 'Respuesta vacía' });

  try {
    await Forum.createReply(id, userId, text);
    // Devolvemos las respuestas actualizadas
    const replies = await Forum.getRepliesByTopic(id);
    res.status(201).json(replies);
  } catch (err) {
    res.status(500).json({ error: 'Error enviando respuesta' });
  }
}

module.exports = { getTopics, createTopic, getTopicDetail, replyToTopic };