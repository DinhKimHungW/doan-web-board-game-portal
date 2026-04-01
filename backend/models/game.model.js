const db = require('./index');

const TABLE = 'games';

/**
 * List all enabled games with average rating.
 */
async function listEnabled() {
  return db(TABLE)
    .where('is_enabled', true)
    .select([
      'games.*',
      db.raw('COALESCE(AVG(gr.rating), 0)::numeric(3,2) AS avg_rating'),
      db.raw('COUNT(gr.id)::int AS review_count'),
    ])
    .leftJoin('game_reviews as gr', 'games.id', 'gr.game_id')
    .groupBy('games.id')
    .orderBy('games.name', 'asc');
}

/**
 * List all games (admin, including disabled).
 */
async function listAll() {
  return db(TABLE)
    .select([
      'games.*',
      db.raw('COALESCE(AVG(gr.rating), 0)::numeric(3,2) AS avg_rating'),
      db.raw('COUNT(gr.id)::int AS review_count'),
    ])
    .leftJoin('game_reviews as gr', 'games.id', 'gr.game_id')
    .groupBy('games.id')
    .orderBy('games.name', 'asc');
}

/**
 * Find game by ID.
 * @param {string} id
 */
async function findById(id) {
  return db(TABLE).where({ id }).first();
}

/**
 * Find game by slug with avg rating.
 * @param {string} slug
 */
async function findBySlug(slug) {
  return db(TABLE)
    .where('games.slug', slug)
    .select([
      'games.*',
      db.raw('COALESCE(AVG(gr.rating), 0)::numeric(3,2) AS avg_rating'),
      db.raw('COUNT(gr.id)::int AS review_count'),
    ])
    .leftJoin('game_reviews as gr', 'games.id', 'gr.game_id')
    .groupBy('games.id')
    .first();
}

/**
 * Update game settings (admin).
 * @param {string} id
 * @param {object} data
 */
async function update(id, data) {
  const [game] = await db(TABLE)
    .where({ id })
    .update({ ...data, updated_at: db.fn.now() })
    .returning('*');
  return game;
}

/**
 * Get games stats for admin.
 */
async function getAdminStats() {
  return db(TABLE)
    .select([
      'games.id',
      'games.slug',
      'games.name',
      'games.type',
      'games.is_enabled',
      db.raw('COALESCE(SUM(ugs.total_plays), 0)::int AS total_plays'),
      db.raw('COALESCE(SUM(ugs.wins), 0)::int AS total_wins'),
      db.raw('COALESCE(AVG(gr.rating), 0)::numeric(3,2) AS avg_rating'),
      db.raw('COUNT(DISTINCT gr.id)::int AS review_count'),
    ])
    .leftJoin('user_game_stats as ugs', 'games.id', 'ugs.game_id')
    .leftJoin('game_reviews as gr', 'games.id', 'gr.game_id')
    .groupBy('games.id')
    .orderBy('total_plays', 'desc');
}

module.exports = {
  TABLE,
  listEnabled,
  listAll,
  findById,
  findBySlug,
  update,
  getAdminStats,
};
