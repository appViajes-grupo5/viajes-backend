const jwt = require('jsonwebtoken');

/**
 * Middleware para verificar el token JWT
 * Extrae el usuario del token y lo agrega a req.user
 */
function authenticateToken(req, res, next) {
  // Obtener el token del header Authorization
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Token de acceso requerido' });
  }

  try {
    // Verificar y decodificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tu_secret_key_aqui');
    
    // Agregar información del usuario al request
    req.user = {
      id: decoded.id,
      email: decoded.email
    };
    
    next();
  } catch (err) {
    console.error('Error verificando token:', err);
    return res.status(403).json({ error: 'Token inválido o expirado' });
  }
}

module.exports = { authenticateToken };

