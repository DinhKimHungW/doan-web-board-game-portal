const ConversationsService = require('../services/conversations.service');
const { success, created } = require('../utils/response.utils');

/**
 * GET /conversations
 */
async function getConversations(req, res, next) {
  try {
    const conversations = await ConversationsService.getConversations(req.user.id);
    return success(res, { conversations });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /conversations
 */
async function createConversation(req, res, next) {
  try {
    const { userId } = req.body;
    const conversation = await ConversationsService.createConversation(req.user.id, userId);
    return created(res, { conversation });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /conversations/:id/messages
 */
async function getMessages(req, res, next) {
  try {
    const { results, pagination } = await ConversationsService.getMessages(
      req.params.id,
      req.user.id,
      req.query
    );
    return success(res, { messages: results }, 200, pagination);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /conversations/:id/messages
 */
async function sendMessage(req, res, next) {
  try {
    const message = await ConversationsService.sendMessage(
      req.params.id,
      req.user.id,
      req.body.content
    );
    return created(res, { message });
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /messages/:id/read
 */
async function markMessageRead(req, res, next) {
  try {
    const message = await ConversationsService.markMessageRead(req.params.id, req.user.id);
    return success(res, { message });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getConversations,
  createConversation,
  getMessages,
  sendMessage,
  markMessageRead,
};
