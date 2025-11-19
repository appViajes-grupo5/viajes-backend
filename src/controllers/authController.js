const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function login(req, res) {
  const { email, password } = req.body;

  // Validar que se envíen email y password
  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña son requeridos' });
  }

  try {
    const user = await User.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: user.user_id, email: user.email },
      process.env.JWT_SECRET || 'tu_secret_key_aqui',
      { expiresIn: '8h' }
    );

    res.json({
      id: user.user_id,
      name: `${user.first_name} ${user.last_name || ''}`.trim(),
      email: user.email,
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error en el login' });
  }
}

async function register(req, res) {
  const { email, password, firstName, lastName } = req.body;

  // Validar campos requeridos
  if (!email || !password || !firstName) {
    return res.status(400).json({ error: 'Email, contraseña y nombre son requeridos' });
  }

  // Validar formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'El formato del email no es válido' });
  }

  // Validar longitud de contraseña
  if (password.length < 6) {
    return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
  }

  try {
    // Verificar si el email ya existe
    const existingUser = await User.getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: 'El email ya está registrado' });
    }

    // Hashear la contraseña
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Crear el usuario
    const userId = await User.crearUsuario(
      email,
      password_hash,
      firstName,
      lastName || null,
      null, // bio
      null, // interests
      null  // profile_picture_url
    );

    // Obtener el usuario creado
    const newUser = await User.getUserById(userId);

    // Generar token JWT
    const token = jwt.sign(
      { id: newUser.user_id, email: newUser.email },
      process.env.JWT_SECRET || 'tu_secret_key_aqui',
      { expiresIn: '8h' }
    );

    // Responder con los datos del usuario y el token
    res.status(201).json({
      id: newUser.user_id,
      name: `${newUser.first_name} ${newUser.last_name || ''}`.trim(),
      email: newUser.email,
      token,
    });
  } catch (err) {
    console.error('Error en registro:', err);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
}

module.exports = { login, register };
