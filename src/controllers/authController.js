const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {
  sendConfirmationEmail,
  sendWelcomeConfirmedEmail,
} = require('../services/emailService');

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

    if (!user.confirmed) {
      return res.status(403).json({
        error:
          'Tu cuenta no ha sido confirmada. Por favor, revisa tu email y confirma tu cuenta antes de iniciar sesión.',
      });
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
    return res
      .status(400)
      .json({ error: 'Email, contraseña y nombre son requeridos' });
  }

  // Validar formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'El formato del email no es válido' });
  }

  // Validar longitud de contraseña
  if (password.length < 6) {
    return res
      .status(400)
      .json({ error: 'La contraseña debe tener al menos 6 caracteres' });
  }

  try {
    // Verificar si el email ya existe
    const existingUser = await User.getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: 'El email ya está registrado' });
    }

    const plainPassword = password;

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
      null // profile_picture_url
    );

    // Obtener el usuario creado
    const newUser = await User.getUserById(userId);

    const fullName = `${newUser.first_name} ${newUser.last_name || ''}`.trim();

    // Generar token de confirmación (expira en 24 horas)
    const confirmationToken = jwt.sign(
      {
        id: newUser.user_id,
        email: newUser.email,
        type: 'confirmation',
      },
      process.env.JWT_SECRET || 'tu_secret_key_aqui',
      { expiresIn: '24h' }
    );

    // Enviar email de confirmación (no bloquea la respuesta si falla)
    sendConfirmationEmail(
      newUser.email,
      fullName,
      plainPassword,
      confirmationToken
    ).catch((err) => {
      console.error('Error al enviar email de confirmación (no crítico):', err);
    });

    // Responder sin token (el usuario debe confirmar primero)
    res.status(201).json({
      message:
        'Usuario registrado exitosamente. Por favor, revisa tu email para confirmar tu cuenta.',
      id: newUser.user_id,
      email: newUser.email,
    });
  } catch (err) {
    console.error('Error en registro:', err);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
}

/**
 * Confirma la cuenta de un usuario usando el token de confirmación
 */
async function confirmAccount(req, res) {
  const { token } = req.params;
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:4200';

  try {
    // Verificar y decodificar el token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'tu_secret_key_aqui'
    );

    // Verificar que el token sea de tipo confirmación
    if (decoded.type !== 'confirmation') {
      return res.redirect(`${frontendUrl}/login?error=token_invalido`);
    }

    // Verificar que el usuario exista
    const user = await User.getUserById(decoded.id);
    if (!user) {
      return res.redirect(`${frontendUrl}/login?error=usuario_no_encontrado`);
    }

    // Verificar que la cuenta no esté ya confirmada
    if (user.confirmed) {
      return res.redirect(`${frontendUrl}/login?message=cuenta_ya_confirmada`);
    }

    // Confirmar la cuenta
    await User.confirmUser(decoded.id);

    // Preparar nombre completo para el email
    const fullName = `${user.first_name} ${user.last_name || ''}`.trim();

    // Enviar email de bienvenida después de la confirmación
    sendWelcomeConfirmedEmail(user.email, fullName).catch((err) => {
      console.error(
        'Error al enviar email de bienvenida confirmado (no crítico):',
        err
      );
    });

    // Redirigir al frontend con mensaje de éxito
    return res.redirect(`${frontendUrl}/login?message=cuenta_confirmada`);
  } catch (err) {
    console.error('Error confirmando cuenta:', err);

    if (err.name === 'TokenExpiredError') {
      return res.redirect(`${frontendUrl}/login?error=token_expirado`);
    }

    if (err.name === 'JsonWebTokenError') {
      return res.redirect(`${frontendUrl}/login?error=token_invalido`);
    }

    return res.redirect(`${frontendUrl}/login?error=error_confirmacion`);
  }
}

async function requestPasswordReset(req, res) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email es requerido' });
  }

  try {
    const user = await User.getUserByEmail(email);
    
    if (!user) {
      return res.json({ 
        message: 'Si el email existe, recibirás un enlace para restablecer tu contraseña' 
      });
    }

    const resetToken = jwt.sign(
      { id: user.user_id, email: user.email, type: 'password_reset' },
      process.env.JWT_SECRET || 'tu_secret_key_aqui',
      { expiresIn: '1h' }
    );

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    await User.setResetToken(user.user_id, resetToken, expiresAt);

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:4200';
    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;

    const { sendPasswordResetEmail } = require('../services/emailService');
    await sendPasswordResetEmail(user.email, `${user.first_name} ${user.last_name || ''}`.trim(), resetUrl);

    res.json({ 
      message: 'Si el email existe, recibirás un enlace para restablecer tu contraseña' 
    });
  } catch (err) {
    console.error('Error solicitando reset de contraseña:', err);
    res.status(500).json({ error: 'Error al procesar la solicitud' });
  }
}

async function resetPassword(req, res) {
  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({ error: 'Token y contraseña son requeridos' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'tu_secret_key_aqui'
    );

    if (decoded.type !== 'password_reset') {
      return res.status(400).json({ error: 'Token inválido' });
    }

    const user = await User.getUserByResetToken(token);
    
    if (!user) {
      return res.status(400).json({ error: 'Token inválido o expirado' });
    }

    const now = new Date();
    const expiresAt = new Date(user.reset_token_expires);
    
    if (now > expiresAt) {
      return res.status(400).json({ error: 'Token expirado' });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    await User.updatePassword(user.user_id, passwordHash);

    const { sendPasswordResetConfirmationEmail } = require('../services/emailService');
    const fullName = `${user.first_name} ${user.last_name || ''}`.trim();
    await sendPasswordResetConfirmationEmail(user.email, fullName, user.email, password).catch((err) => {
      console.error('Error enviando email de confirmación de reset (no crítico):', err);
    });

    res.json({ message: 'Contraseña restablecida exitosamente' });
  } catch (err) {
    console.error('Error restableciendo contraseña:', err);
    
    if (err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError') {
      return res.status(400).json({ error: 'Token inválido o expirado' });
    }
    
    res.status(500).json({ error: 'Error al restablecer la contraseña' });
  }
}

module.exports = { login, register, confirmAccount, requestPasswordReset, resetPassword };
