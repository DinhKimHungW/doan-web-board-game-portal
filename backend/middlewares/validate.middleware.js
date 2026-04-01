const { validationResult } = require('express-validator');
const { error } = require('../utils/response.utils');

/**
 * Middleware factory: runs express-validator checks and returns 422 on failure.
 * Use this AFTER defining your validation chain.
 * @type {import('express').RequestHandler}
 */
function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return error(
      res,
      'Validation failed. Please check your input.',
      422,
      errors.array().map((e) => ({ field: e.path, message: e.msg }))
    );
  }
  next();
}

module.exports = { validate };
