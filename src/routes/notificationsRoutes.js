const express = require('express');
const router = express.Router();
const notificationsController = require('../controllers/notificationsController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// Todas las rutas requieren estar logueado
router.use(authMiddleware);

// Crear notificación
router.post('/', notificationsController.create);

// Listar notificaciones de un usuario
router.get('/', notificationsController.getMyNotifications);

// Marcar como leída
router.put('/:notification_id/read', notificationsController.markRead);

// Eliminar notificación
router.delete('/:notification_id', notificationsController.remove);

module.exports = router;
