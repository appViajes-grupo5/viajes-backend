const express = require('express');
const router = express.Router();
const userController = require('../controllers/usuarios');
const { authenticateToken } = require('../middleware/authMiddleware');

// Ruta para obtener el usuario actual (autenticado)
router.get('/me', authenticateToken, userController.getCurrentUser);

// Ruta para actualizar el usuario actual (autenticado)
router.put('/me', authenticateToken, userController.updateUser);

// Ruta para obtener un usuario por ID (público o protegido según necesites)
router.get('/:id', userController.getUserById);

module.exports = router;

