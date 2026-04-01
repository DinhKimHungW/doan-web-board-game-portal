const { body, param, query } = require('express-validator');

const createConversation = [
  body('userId')
    .notEmpty().withMessage('User ID is required.')
    .isUUID().withMessage('User ID must be a valid UUID.'),
];

const sendMessage = [
  body('content')
    .trim()
    .notEmpty().withMessage('Message content is required.')
    .isLength({ min: 1, max: 5000 }).withMessage('Message must be between 1 and 5000 characters.'),
];

const listMessages = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer.'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100.'),
];

module.exports = { createConversation, sendMessage, listMessages };
