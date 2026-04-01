const db = require('./index');

/**
 * Get global rankings for a specific game.
 * @param {string} gameId
 * @param {{ limit: number, offset: number }} pagination
 */
async function getGlobalRankings(gameId, { limit, offset }) {
  const results = await db('user_game_stats')
    .where({ game_id: gameId })
    .join('users', 'user_game_stats.user_id', 'users.id')
    .where('users.is_active', true)
    .select([
      'user_game_stats.user_id',
      'users.name',
      'users.avatar_url',
      'user_game_stats.best_score',
      'user_game_stats.total_plays',
      'user_game_stats.wins',
      'user_game_stats.losses',
      'user_game_stats.draws',
      'user_game_stats.last_played_at',
      db.raw('ROW_NUMBER() OVER (ORDER BY user_game_stats.best_score DESC) AS rank'),
    ])
    .orderBy('user_game_stats.best_score', 'desc')
    .limit(limit)
    .offset(offset);

  const [{ count }] = await db('user_game_stats')
    .where({ game_id: gameId })
    .join('users', 'user_game_stats.user_id', 'users.id')
    .where('users.is_active', true)
    .count('user_game_stats.id as count');

  return { results, total: parseInt(count, 10) };
}

/**
 * Get rankings among friends only.
 * @param {string} gameId
 * @param {string} userId
 * @param {string[]} friendIds
 * @param {{ limit: number, offset: number }} pagination
 */
async function getFriendRankings(gameId, userId, friendIds, { limit, offset }) {
  const includeIds = [userId, ...friendIds];

  const results = await db('user_game_stats')
    .where({ game_id: gameId })
    .whereIn('user_game_stats.user_id', includeIds)
    .join('users', 'user_game_stats.user_id', 'users.id')
    .select([
      'user_game_stats.user_id',
      'users.name',
      'users.avatar_url',
      'user_game_stats.best_score',
      'user_game_stats.total_plays',
      'user_game_stats.wins',
      'user_game_stats.losses',
      'user_game_stats.draws',
      'user_game_stats.last_played_at',
      db.raw('ROW_NUMBER() OVER (ORDER BY user_game_stats.best_score DESC) AS rank'),
    ])
    .orderBy('user_game_stats.best_score', 'desc')
    .limit(limit)
    .offset(offset);

  const [{ count }] = await db('user_game_stats')
    .where({ game_id: gameId })
    .whereIn('user_game_stats.user_id', includeIds)
    .count('user_game_stats.id as count');

  return { results, total: parseInt(count, 10) };
}

/**
 * Get self stats (user's own ranking across all games).
 * @param {string} userId
 * @param {string} [gameId]
 * @param {{ limit: number, offset: number }} pagination
 */
async function getSelfRankings(userId, gameId, { limit, offset }) {
  let query = db('user_game_stats')
    .where({ 'user_game_stats.user_id': userId })
    .join('games', 'user_game_stats.game_id', 'games.id')
    .select([
      'user_game_stats.*',
      'games.slug as game_slug',
      'games.name as game_name',
    ])
    .orderBy('user_game_stats.best_score', 'desc');

  if (gameId) query = query.where('user_game_stats.game_id', gameId);

  const results = await query.clone().limit(limit).offset(offset);
  const [{ count }] = await query.clone().count('user_game_stats.id as count').clearOrder().clearSelect();

  return { results, total: parseInt(count, 10) };
}

/**
 * Upsert user game stats after a completed session.
 * @param {string} userId
 * @param {string} gameId
 * @param {{ score: number, result: string, elapsed_seconds: number }} sessionData
 */
async function upsertStats(userId, gameId, { score, result, elapsed_seconds }) {
  const existing = await db('user_game_stats')
    .where({ user_id: userId, game_id: gameId })
    .first();

  if (!existing) {
    await db('user_game_stats').insert({
      user_id: userId,
      game_id: gameId,
      total_plays: 1,
      wins: result === 'WIN' ? 1 : 0,
      losses: result === 'LOSE' ? 1 : 0,
      draws: result === 'DRAW' ? 1 : 0,
      best_score: score,
      total_score: score,
      best_time: elapsed_seconds > 0 ? elapsed_seconds : null,
      last_played_at: db.fn.now(),
      updated_at: db.fn.now(),
    });
  } else {
    const updates = {
      total_plays: existing.total_plays + 1,
      wins: existing.wins + (result === 'WIN' ? 1 : 0),
      losses: existing.losses + (result === 'LOSE' ? 1 : 0),
      draws: existing.draws + (result === 'DRAW' ? 1 : 0),
      total_score: existing.total_score + score,
      best_score: Math.max(existing.best_score, score),
      last_played_at: db.fn.now(),
      updated_at: db.fn.now(),
    };

    // Update best_time only if this session was faster or no prior best
    if (elapsed_seconds > 0) {
      if (!existing.best_time || elapsed_seconds < existing.best_time) {
        updates.best_time = elapsed_seconds;
      }
    }

    await db('user_game_stats').where({ user_id: userId, game_id: gameId }).update(updates);
  }

  return db('user_game_stats').where({ user_id: userId, game_id: gameId }).first();
}

module.exports = {
  getGlobalRankings,
  getFriendRankings,
  getSelfRankings,
  upsertStats,
};
