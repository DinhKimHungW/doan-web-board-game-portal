const { body, query } = require('express-validator');

const updateProfile = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters.'),

  body('bio')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Bio must not exceed 500 characters.'),

  body('avatar_url')
    .optional({ nullable: true })
    .trim()
    .isURL().withMessage('Avatar URL must be a valid URL.')
    .isLength({ max: 500 }).withMessage('Avatar URL must not exceed 500 characters.'),

  body('theme_preference')
    .optional()
    .isIn(['light', 'dark']).withMessage('Theme must be either "light" or "dark".'),
];

const changePassword = [
  body('currentPassword')
    .notEmpty().withMessage('Current password is required.'),

  body('newPassword')
    .notEmpty().withMessage('New password is required.')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters.')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter.')
    .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter.')
    .matches(/[0-9]/).withMessage('Password must contain at least one number.')
    .matches(/[@$!%*?&#]/).withMessage('Password must contain at least one special character (@$!%*?&#).'),

  body('confirmPassword')
    .notEmpty().withMessage('Password confirmation is required.')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Passwords do not match.');
      }
      return true;
    }),
];

const searchUsers = [
  query('q')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 }).withMessage('Search query must be between 1 and 100 characters.'),

  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer.'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100.'),
];

module.exports = { updateProfile, changePassword, searchUsers };
