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


async function obtenerUsuario(req, res) {
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

async function actualizarUsuario(req, res) {
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

module.exports = { crearUsuarios, obtenerUsuario, actualizarUsuario };
