const UserModel = require('../models/user.model');
const GameModel = require('../models/game.model');
const db = require('../models/index');
const { parsePagination, buildPaginationMeta } = require('../utils/pagination.utils');

/**
 * List all users with pagination (admin).
 * @param {{ page?: number, limit?: number, q?: string }} query
 */
async function listUsers(query) {
  const { page, limit, offset } = parsePagination(query);
  const { results, total } = await UserModel.listAll({ limit, offset, q: query.q });

  // Strip password hashes from results
  const safeResults = results.map(({ password_hash, ...user }) => user);

  return {
    results: safeResults,
    pagination: buildPaginationMeta({ page, limit, total }),
  };
}

/**
 * Update user (admin can change is_active, role, name).
 * @param {string} userId
 * @param {{ is_active?: boolean, role?: string, name?: string }} data
 */
async function updateUser(userId, data) {
  const user = await UserModel.findById(userId);
  if (!user) {
    const err = new Error('User not found.');
    err.status = 404;
    throw err;
  }

  const allowedFields = ['is_active', 'role', 'name'];
  const updateData = {};
  for (const field of allowedFields) {
    if (data[field] !== undefined) {
      updateData[field] = data[field];
    }
  }

  if (Object.keys(updateData).length === 0) {
    const err = new Error('No valid fields provided for update.');
    err.status = 400;
    throw err;
  }

  return UserModel.update(userId, updateData);
}

/**
 * List all games (admin, including disabled).
 */
async function listGames() {
  return GameModel.listAll();
}

/**
 * Update game settings (admin).
 * @param {string} gameId
 * @param {{ is_enabled?: boolean, name?: string, description?: string, default_time_limit?: number, config_json?: object }} data
 */
async function updateGame(gameId, data) {
  const game = await GameModel.findById(gameId);
  if (!game) {
    const err = new Error('Game not found.');
    err.status = 404;
    throw err;
  }

  const allowedFields = ['is_enabled', 'name', 'description', 'default_time_limit', 'config_json'];
  const updateData = {};
  for (const field of allowedFields) {
    if (data[field] !== undefined) {
      updateData[field] = data[field];
    }
  }

  if (Object.keys(updateData).length === 0) {
    const err = new Error('No valid fields provided for update.');
    err.status = 400;
    throw err;
  }

  return GameModel.update(gameId, updateData);
}

/**
 * Get overview stats for admin dashboard.
 */
async function getOverviewStats() {
  const [userStats] = await db('users')
    .select([
      db.raw('COUNT(*)::int AS total_users'),
      db.raw("COUNT(*) FILTER (WHERE is_active = true)::int AS active_users"),
      db.raw("COUNT(*) FILTER (WHERE role = 'ADMIN')::int AS admin_count"),
      db.raw("COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days')::int AS new_users_last_7_days"),
    ]);

  const [sessionStats] = await db('game_sessions')
    .select([
      db.raw('COUNT(*)::int AS total_sessions'),
      db.raw("COUNT(*) FILTER (WHERE status = 'FINISHED')::int AS finished_sessions"),
      db.raw("COUNT(*) FILTER (WHERE status = 'IN_PROGRESS')::int AS active_sessions"),
      db.raw("COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days')::int AS sessions_last_7_days"),
    ]);

  const [messageStats] = await db('messages')
    .select([
      db.raw('COUNT(*)::int AS total_messages'),
      db.raw("COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days')::int AS messages_last_7_days"),
    ]);

  const [friendStats] = await db('friendships')
    .select([
      db.raw('COUNT(*)::int AS total_friend_requests'),
      db.raw("COUNT(*) FILTER (WHERE status = 'ACCEPTED')::int AS accepted_friendships"),
    ]);

  return {
    users: userStats,
    sessions: sessionStats,
    messages: messageStats,
    friendships: friendStats,
  };
}

/**
 * Get per-game stats for admin.
 */
async function getGameStats() {
  return GameModel.getAdminStats();
}

/**
 * Get user activity stats for admin.
 * @param {{ limit?: number }} options
 */
async function getUserStats({ limit = 20 } = {}) {
  const topPlayers = await db('user_game_stats')
    .join('users', 'user_game_stats.user_id', 'users.id')
    .select([
      'users.id',
      'users.name',
      'users.email',
      'users.is_active',
      db.raw('SUM(user_game_stats.total_plays)::int AS total_plays'),
      db.raw('SUM(user_game_stats.wins)::int AS total_wins'),
      db.raw('SUM(user_game_stats.total_score)::int AS total_score'),
    ])
    .groupBy('users.id')
    .orderBy('total_plays', 'desc')
    .limit(limit);

  const registrationsPerDay = await db('users')
    .select([
      db.raw("DATE(created_at) AS date"),
      db.raw('COUNT(*)::int AS count'),
    ])
    .where('created_at', '>=', db.raw("NOW() - INTERVAL '30 days'"))
    .groupByRaw('DATE(created_at)')
    .orderBy('date', 'asc');

  return {
    top_players: topPlayers,
    registrations_per_day: registrationsPerDay,
  };
}

module.exports = {
  listUsers,
  updateUser,
  listGames,
  updateGame,
  getOverviewStats,
  getGameStats,
  getUserStats,
};
