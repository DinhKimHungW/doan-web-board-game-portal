const db = require('./index');

const CONV_TABLE = 'conversations';
const PART_TABLE = 'conversation_participants';
const MSG_TABLE = 'messages';

/**
 * List conversations for a user with last message and unread count.
 * @param {string} userId
 */
async function listForUser(userId) {
  // Get all conversation IDs the user is part of
  const convIds = await db(PART_TABLE)
    .where({ user_id: userId })
    .pluck('conversation_id');

  if (!convIds.length) return [];

  // For each conversation, get participants and last message
  const conversations = await db(CONV_TABLE)
    .whereIn('conversations.id', convIds)
    .select(['conversations.id', 'conversations.created_at'])
    .orderBy('conversations.created_at', 'desc');

  // Enrich with participants and last message
  const enriched = await Promise.all(
    conversations.map(async (conv) => {
      const participants = await db(PART_TABLE)
        .where({ conversation_id: conv.id })
        .join('users', 'conversation_participants.user_id', 'users.id')
        .select(['users.id', 'users.name', 'users.email', 'users.avatar_url']);

      const lastMessage = await db(MSG_TABLE)
        .where({ conversation_id: conv.id })
        .orderBy('created_at', 'desc')
        .first();

      const unreadCount = await db(MSG_TABLE)
        .where({ conversation_id: conv.id, is_read: false })
        .whereNot({ sender_id: userId })
        .count('id as count')
        .first();

      return {
        ...conv,
        participants,
        last_message: lastMessage || null,
        unread_count: parseInt(unreadCount.count, 10),
      };
    })
  );

  return enriched;
}

/**
 * Create a conversation and add participants.
 * @param {string[]} userIds
 */
async function create(userIds) {
  return db.transaction(async (trx) => {
    const [conv] = await trx(CONV_TABLE).insert({}).returning('*');

    const participants = userIds.map((user_id) => ({
      conversation_id: conv.id,
      user_id,
    }));
    await trx(PART_TABLE).insert(participants);

    return conv;
  });
}

/**
 * Find an existing conversation between exactly two users.
 * @param {string} userA
 * @param {string} userB
 */
async function findBetweenTwo(userA, userB) {
  // Find conversations where both users are participants and there are exactly 2 participants
  const result = await db.raw(
    `SELECT c.id
     FROM conversations c
     JOIN conversation_participants cp1 ON c.id = cp1.conversation_id AND cp1.user_id = ?
     JOIN conversation_participants cp2 ON c.id = cp2.conversation_id AND cp2.user_id = ?
     WHERE (
       SELECT COUNT(*) FROM conversation_participants cp3
       WHERE cp3.conversation_id = c.id
     ) = 2
     LIMIT 1`,
    [userA, userB]
  );

  return result.rows[0] || null;
}

/**
 * Check if a user is in a conversation.
 * @param {string} conversationId
 * @param {string} userId
 */
async function isParticipant(conversationId, userId) {
  const row = await db(PART_TABLE)
    .where({ conversation_id: conversationId, user_id: userId })
    .first();
  return !!row;
}

/**
 * Get a conversation by ID.
 * @param {string} id
 */
async function findById(id) {
  return db(CONV_TABLE).where({ id }).first();
}

module.exports = {
  CONV_TABLE,
  PART_TABLE,
  MSG_TABLE,
  listForUser,
  create,
  findBetweenTwo,
  isParticipant,
  findById,
};
