const { body, param } = require('express-validator');

const sendRequest = [
  body('receiverId')
    .notEmpty().withMessage('Receiver ID is required.')
    .isUUID().withMessage('Receiver ID must be a valid UUID.'),
];

const requestId = [
  param('id')
    .notEmpty().withMessage('Request ID is required.')
    .isUUID().withMessage('Request ID must be a valid UUID.'),
];

const friendId = [
  param('friendId')
    .notEmpty().withMessage('Friend ID is required.')
    .isUUID().withMessage('Friend ID must be a valid UUID.'),
];

module.exports = { sendRequest, requestId, friendId };
