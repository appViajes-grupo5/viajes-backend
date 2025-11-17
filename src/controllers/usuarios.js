const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');



async function crearUsuarios(req, res) {
  const { email, password_hash,first_name,last_name,bio,interests,profile_picture_url, average_rating } = req.body;

  try {
    password_hash = await bcrypt.hash(password_hash, 10);
    const user = await User.crearUsuarios(email, password_hash,first_name,last_name,bio,interests,profile_picture_url, average_rating);
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

 
    res.json({
        message: 'Usuario creado exitosamente',
        userId: user
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error en el login' });
  }
}

module.exports = { login };
