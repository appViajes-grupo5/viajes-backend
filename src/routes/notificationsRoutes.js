const express = require('express');
const router = express.Router();
const notificationsController = require('../controllers/notificationsController');

// Crear notificación
router.post('/', notificationsController.create);

// Listar notificaciones de un usuario
router.get('/user/:user_id', notificationsController.listByUser);

// Marcar como leída
router.put('/:notification_id/read', notificationsController.markRead);

// Eliminar notificación
router.delete('/:notification_id', notificationsController.remove);

module.exports = router;
