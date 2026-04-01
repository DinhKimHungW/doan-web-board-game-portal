const { verifyAccessToken } = require('../utils/jwt.utils');
const { unauthorized } = require('../utils/response.utils');

/**
 * Middleware to verify JWT access token and attach user to request.
 * @type {import('express').RequestHandler}
 */
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return unauthorized(res, 'Authentication required. Please provide a valid Bearer token.');
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = verifyAccessToken(token);
    req.user = {
      id: payload.id,
      email: payload.email,
      role: payload.role,
    };
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return unauthorized(res, 'Access token has expired. Please refresh your token.');
    }
    if (err.name === 'JsonWebTokenError') {
      return unauthorized(res, 'Invalid access token.');
    }
    return unauthorized(res, 'Authentication failed.');
  }
}

module.exports = { authenticate };
