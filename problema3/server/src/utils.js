const jwt = require('jsonwebtoken');
const APP_SECRET = 'Clave-super-secretaa';

function getTokenPayload(token) {
  return jwt.verify(token, APP_SECRET);
}

function getUserData(req, authToken) {
  if (req) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      if (!token) {
        throw new Error('No token found');
      }
      const { usuarioId, rol } = getTokenPayload(token);
      return {usuarioId,rol};
    }
  } else if (authToken) {
    const { usuarioId, rol } = getTokenPayload(authToken);
    return {usuarioId, rol};
  }

  throw new Error('Not authenticated');
}

module.exports = {
  APP_SECRET,
  getUserData
};
