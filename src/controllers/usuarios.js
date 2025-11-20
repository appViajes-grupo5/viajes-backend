const User = require('../models/userModel');

/**
 * Obtener el usuario actual (autenticado)
 * GET /api/users/me
 */
async function getCurrentUser(req, res) {
  try {
    const userId = req.user.id;
    const user = await User.getUserById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Retornar datos del usuario sin el password_hash
    // Solo campos editables: first_name, last_name, phone, bio, interests, profile_picture_url
    res.json({
      id: user.user_id,
      email: user.email, // Solo lectura
      firstName: user.first_name,
      lastName: user.last_name,
      phone: user.phone,
      bio: user.bio,
      interests: user.interests,
      profilePictureUrl: user.profile_picture_url,
      averageRating: user.average_rating, // Solo lectura (calculado)
      createdAt: user.created_at // Solo lectura (timestamp automático)
    });
  } catch (err) {
    console.error('Error obteniendo usuario:', err);
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
}

/**
 * Actualizar el usuario actual (autenticado)
 * PUT /api/users/me
 */
async function updateUser(req, res) {
  try {
    const userId = req.user.id;
    // Solo se pueden editar: firstName, lastName, phone, bio, interests, profilePictureUrl
    const { firstName, lastName, phone, bio, interests, profilePictureUrl } = req.body;

    // Validar que al menos un campo se esté actualizando
    if (!firstName && !lastName && phone === undefined && bio === undefined && interests === undefined && profilePictureUrl === undefined) {
      return res.status(400).json({ error: 'Debe proporcionar al menos un campo para actualizar' });
    }

    // Preparar datos para actualizar (solo campos editables)
    const updateData = {};
    if (firstName !== undefined) updateData.first_name = firstName;
    if (lastName !== undefined) updateData.last_name = lastName;
    if (phone !== undefined) updateData.phone = phone;
    if (bio !== undefined) updateData.bio = bio;
    if (interests !== undefined) updateData.interests = interests;
    if (profilePictureUrl !== undefined) updateData.profile_picture_url = profilePictureUrl;

    // Actualizar usuario
    const updatedUser = await User.updateUser(userId, updateData);

    // Retornar datos actualizados
    res.json({
      id: updatedUser.user_id,
      email: updatedUser.email, // Solo lectura
      firstName: updatedUser.first_name,
      lastName: updatedUser.last_name,
      phone: updatedUser.phone,
      bio: updatedUser.bio,
      interests: updatedUser.interests,
      profilePictureUrl: updatedUser.profile_picture_url,
      averageRating: updatedUser.average_rating, // Solo lectura
      createdAt: updatedUser.created_at // Solo lectura
    });
  } catch (err) {
    console.error('Error actualizando usuario:', err);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
}

/**
 * Obtener un usuario por ID (para administradores o para ver perfiles públicos)
 * GET /api/users/:id
 */
async function getUserById(req, res) {
  try {
    const userId = req.params.id;
    const user = await User.getUserById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Retornar datos públicos del usuario (sin password_hash)
    res.json({
      id: user.user_id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      phone: user.phone,
      bio: user.bio,
      interests: user.interests,
      profilePictureUrl: user.profile_picture_url,
      averageRating: user.average_rating,
      createdAt: user.created_at
    });
  } catch (err) {
    console.error('Error obteniendo usuario:', err);
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
}

module.exports = {
  getCurrentUser,
  updateUser,
  getUserById
};

