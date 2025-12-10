const express = require('express');
const router = express.Router();
const userController = require('../controllers/usuarios');
const { authMiddleware } = require('../middlewares/authMiddleware');

// Ruta para obtener el usuario actual (autenticado)
router.get('/me', authMiddleware, userController.getCurrentUser);

// Ruta para actualizar el usuario actual (autenticado)
router.put('/me', authMiddleware, userController.updateUser);

// Ruta para obtener un usuario por ID (público o protegido según necesites)
router.get('/:id', userController.getUserById);

module.exports = router;

