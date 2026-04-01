const { body, query } = require('express-validator');

const updateUser = [
  body('is_active')
    .optional()
    .isBoolean().withMessage('is_active must be a boolean.'),

  body('role')
    .optional()
    .isIn(['USER', 'ADMIN']).withMessage('Role must be USER or ADMIN.'),

  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters.'),
];

const updateGame = [
  body('is_enabled')
    .optional()
    .isBoolean().withMessage('is_enabled must be a boolean.'),

  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 }).withMessage('Name must be between 1 and 200 characters.'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Description must not exceed 2000 characters.'),

  body('default_time_limit')
    .optional({ nullable: true })
    .isInt({ min: 0 }).withMessage('Default time limit must be a non-negative integer.'),

  body('config_json')
    .optional({ nullable: true })
    .isObject().withMessage('Config must be a JSON object.'),
];

const listUsers = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer.'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100.'),

  query('q')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Search query must not exceed 100 characters.'),
];

module.exports = { updateUser, updateGame, listUsers };
