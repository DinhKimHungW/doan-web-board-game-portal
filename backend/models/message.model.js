const db = require('./index');

const TABLE = 'messages';

/**
 * List messages in a conversation with pagination.
 * @param {string} conversationId
 * @param {{ limit: number, offset: number }} pagination
 */
async function listByConversation(conversationId, { limit, offset }) {
  const results = await db(TABLE)
    .where({ conversation_id: conversationId })
    .select([
      'messages.*',
      'users.name as sender_name',
      'users.avatar_url as sender_avatar',
    ])
    .join('users', 'messages.sender_id', 'users.id')
    .orderBy('messages.created_at', 'desc')
    .limit(limit)
    .offset(offset);

  const [{ count }] = await db(TABLE)
    .where({ conversation_id: conversationId })
    .count('id as count');

  return { results: results.reverse(), total: parseInt(count, 10) };
}

/**
 * Create a message.
 * @param {{ conversation_id: string, sender_id: string, content: string }} data
 */
async function create(data) {
  const [message] = await db(TABLE).insert(data).returning('*');
  return message;
}

/**
 * Find a message by ID.
 * @param {string} id
 */
async function findById(id) {
  return db(TABLE).where({ id }).first();
}

/**
 * Mark a message as read.
 * @param {string} id
 */
async function markRead(id) {
  const [message] = await db(TABLE).where({ id }).update({ is_read: true }).returning('*');
  return message;
}

module.exports = {
  TABLE,
  listByConversation,
  create,
  findById,
  markRead,
};
