const Notifications = require('../models/notificationsModel');

async function create(req, res) {
  const { user_id, message, link } = req.body;

  if (!user_id || !message) {
    return res.status(400).json({ error: 'user_id y message son obligatorios' });
  }

  try {
    const id = await Notifications.createNotification(user_id, message, link);
    const newNotification = await Notifications.getNotificationById(id);
    res.status(201).json(newNotification);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear notificación' });
  }
}

async function listByUser(req, res) {
  const { user_id } = req.params;

  try {
    const notifications = await Notifications.getNotificationsByUser(user_id);
    res.json(notifications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener notificaciones' });
  }
}

async function markRead(req, res) {
  const { notification_id } = req.params;

  try {
    const updated = await Notifications.markAsRead(notification_id);

    if (!updated) {
      return res.status(404).json({ error: 'Notificación no encontrada' });
    }

    const updatedNotification = await Notifications.getNotificationById(notification_id);
    res.json(updatedNotification);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al marcar como leída' });
  }
}

async function remove(req, res) {
  const { notification_id } = req.params;

  try {
    const deleted = await Notifications.deleteNotification(notification_id);

    if (!deleted) {
      return res.status(404).json({ error: 'Notificación no encontrada' });
    }

    res.json({ message: 'Notificación eliminada' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar la notificación' });
  }
}

module.exports = {
  create,
  listByUser,
  markRead,
  remove
};
