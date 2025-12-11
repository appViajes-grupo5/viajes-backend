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

async function getMyNotifications(req, res) {
  const user_id = req.user.id;

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
  const userId = req.user.id; // Obtenemos el ID del usuario autenticado

  try {
    // 1. Primero obtenemos la notificación para ver de quién es
    const notification = await Notifications.getNotificationById(notification_id);

    if (!notification) {
      return res.status(404).json({ error: 'Notificación no encontrada' });
    }

    // 2. Verificamos propiedad
    if (notification.user_id !== userId) {
      return res.status(403).json({ error: 'No tienes permiso para modificar esta notificación' });
    }

    // 3. Procedemos
    await Notifications.markAsRead(notification_id);
    const updatedNotification = await Notifications.getNotificationById(notification_id);
    res.json(updatedNotification);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al marcar como leída' });
  }
}

async function remove(req, res) {
  const { notification_id } = req.params;
  const userId = req.user.id;

  try {
    const notification = await Notifications.getNotificationById(notification_id);
    
    if (!notification) {
      return res.status(404).json({ error: 'Notificación no encontrada' });
    }

    if (notification.user_id !== userId) {
      return res.status(403).json({ error: 'No tienes permiso para eliminar esta notificación' });
    }

    const deleted = await Notifications.deleteNotification(notification_id);
    res.json({ message: 'Notificación eliminada' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar la notificación' });
  }
}

module.exports = {
  create,
  getMyNotifications,
  markRead,
  remove
};
