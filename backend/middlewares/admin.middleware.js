const { forbidden } = require('../utils/response.utils');

/**
 * Middleware to restrict access to ADMIN role only.
 * Must be used after authenticate middleware.
 * @type {import('express').RequestHandler}
 */
function requireAdmin(req, res, next) {
  if (!req.user) {
    return forbidden(res, 'Authentication required.');
  }

  if (req.user.role !== 'ADMIN') {
    return forbidden(res, 'Access denied. Administrator privileges required.');
  }

  next();
}

module.exports = { requireAdmin };
