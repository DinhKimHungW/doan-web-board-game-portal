const db = require('./index');

const TABLE = 'game_sessions';

/**
 * Create a new game session.
 * @param {object} data
 */
async function create(data) {
  const [session] = await db(TABLE).insert(data).returning('*');
  return session;
}

/**
 * Find a session by ID.
 * @param {string} id
 */
async function findById(id) {
  return db(TABLE)
    .where('game_sessions.id', id)
    .select([
      'game_sessions.*',
      'games.slug as game_slug',
      'games.name as game_name',
    ])
    .join('games', 'game_sessions.game_id', 'games.id')
    .first();
}

/**
 * List sessions for a user.
 * @param {string} userId
 * @param {{ limit: number, offset: number, status?: string }} options
 */
async function listByUser(userId, { limit, offset, status }) {
  let query = db(TABLE)
    .where('game_sessions.user_id', userId)
    .select([
      'game_sessions.*',
      'games.slug as game_slug',
      'games.name as game_name',
    ])
    .join('games', 'game_sessions.game_id', 'games.id')
    .orderBy('game_sessions.created_at', 'desc');

  if (status) query = query.where('game_sessions.status', status);

  const results = await query.clone().limit(limit).offset(offset);
  const [{ count }] = await query.clone().count('game_sessions.id as count').clearOrder().clearSelect();

  return { results, total: parseInt(count, 10) };
}

/**
 * Update a session's game state.
 * @param {string} id
 * @param {object} data
 */
async function updateState(id, data) {
  const [session] = await db(TABLE)
    .where({ id })
    .update({ ...data, updated_at: db.fn.now() })
    .returning('*');
  return session;
}

/**
 * Complete a session (set status to FINISHED).
 * @param {string} id
 * @param {{ score: number, result: string }} data
 */
async function complete(id, { score, result }) {
  const [session] = await db(TABLE)
    .where({ id })
    .update({
      status: 'FINISHED',
      score,
      result,
      completed_at: db.fn.now(),
      updated_at: db.fn.now(),
    })
    .returning('*');
  return session;
}

/**
 * Save a session (set status to SAVED).
 * @param {string} id
 */
async function markSaved(id) {
  const [session] = await db(TABLE)
    .where({ id })
    .update({ status: 'SAVED', saved_at: db.fn.now(), updated_at: db.fn.now() })
    .returning('*');
  return session;
}

module.exports = {
  TABLE,
  create,
  findById,
  listByUser,
  updateState,
  complete,
  markSaved,
};
