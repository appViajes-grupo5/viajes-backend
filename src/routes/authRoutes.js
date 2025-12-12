const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Rutas públicas de autenticación
router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/confirm/:token', authController.confirmAccount);

module.exports = router;
