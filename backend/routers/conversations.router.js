const express = require('express');
const router = express.Router();
const ConversationsController = require('../controllers/conversations.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');
const ConvValidator = require('../validators/conversations.validator');

router.use(authenticate);

// GET /api/v1/conversations
router.get('/', ConversationsController.getConversations);

// POST /api/v1/conversations
router.post('/', ConvValidator.createConversation, validate, ConversationsController.createConversation);

// GET /api/v1/conversations/:id/messages
router.get('/:id/messages', ConvValidator.listMessages, validate, ConversationsController.getMessages);

// POST /api/v1/conversations/:id/messages
router.post('/:id/messages', ConvValidator.sendMessage, validate, ConversationsController.sendMessage);

module.exports = router;
