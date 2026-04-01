const ConversationModel = require('../models/conversation.model');
const MessageModel = require('../models/message.model');
const FriendModel = require('../models/friend.model');
const UserModel = require('../models/user.model');
const { parsePagination, buildPaginationMeta } = require('../utils/pagination.utils');

/**
 * List conversations for current user.
 * @param {string} userId
 */
async function getConversations(userId) {
  return ConversationModel.listForUser(userId);
}

/**
 * Create or get existing conversation between two users.
 * @param {string} currentUserId
 * @param {string} targetUserId
 */
async function createConversation(currentUserId, targetUserId) {
  if (currentUserId === targetUserId) {
    const err = new Error('You cannot start a conversation with yourself.');
    err.status = 400;
    throw err;
  }

  // Check target user exists and is active
  const targetUser = await UserModel.findById(targetUserId);
  if (!targetUser || !targetUser.is_active) {
    const err = new Error('User not found.');
    err.status = 404;
    throw err;
  }

  // Must be friends to start a conversation
  const areFriends = await FriendModel.areFriends(currentUserId, targetUserId);
  if (!areFriends) {
    const err = new Error('You can only start conversations with friends.');
    err.status = 403;
    throw err;
  }

  // Check for existing conversation between the two
  const existing = await ConversationModel.findBetweenTwo(currentUserId, targetUserId);
  if (existing) {
    // Return enriched conversation
    const convs = await ConversationModel.listForUser(currentUserId);
    return convs.find((c) => c.id === existing.id) || existing;
  }

  const conv = await ConversationModel.create([currentUserId, targetUserId]);
  const convs = await ConversationModel.listForUser(currentUserId);
  return convs.find((c) => c.id === conv.id) || conv;
}

/**
 * Get messages for a conversation with pagination.
 * @param {string} conversationId
 * @param {string} userId
 * @param {{ page?: number, limit?: number }} query
 */
async function getMessages(conversationId, userId, query) {
  // Verify user is a participant
  const isParticipant = await ConversationModel.isParticipant(conversationId, userId);
  if (!isParticipant) {
    const err = new Error('Conversation not found or you are not a participant.');
    err.status = 403;
    throw err;
  }

  const { page, limit, offset } = parsePagination(query, { defaultLimit: 50 });
  const { results, total } = await MessageModel.listByConversation(conversationId, { limit, offset });

  return {
    results,
    pagination: buildPaginationMeta({ page, limit, total }),
  };
}

/**
 * Send a message to a conversation.
 * @param {string} conversationId
 * @param {string} senderId
 * @param {string} content
 */
async function sendMessage(conversationId, senderId, content) {
  // Verify user is a participant
  const isParticipant = await ConversationModel.isParticipant(conversationId, senderId);
  if (!isParticipant) {
    const err = new Error('Conversation not found or you are not a participant.');
    err.status = 403;
    throw err;
  }

  const message = await MessageModel.create({
    conversation_id: conversationId,
    sender_id: senderId,
    content: content.trim(),
  });

  return message;
}

/**
 * Mark a message as read.
 * @param {string} messageId
 * @param {string} userId - must be in the same conversation
 */
async function markMessageRead(messageId, userId) {
  const message = await MessageModel.findById(messageId);
  if (!message) {
    const err = new Error('Message not found.');
    err.status = 404;
    throw err;
  }

  // Verify user is a participant in the conversation
  const isParticipant = await ConversationModel.isParticipant(message.conversation_id, userId);
  if (!isParticipant) {
    const err = new Error('Access denied.');
    err.status = 403;
    throw err;
  }

  if (message.sender_id === userId) {
    // Can't mark own messages as read (they're always "read" from sender perspective)
    return message;
  }

  return MessageModel.markRead(messageId);
}

module.exports = {
  getConversations,
  createConversation,
  getMessages,
  sendMessage,
  markMessageRead,
};
