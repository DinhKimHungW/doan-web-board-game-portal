const db = require('./index');

const ACHIEVEMENT_TABLE = 'achievements';
const USER_ACHIEVEMENT_TABLE = 'user_achievements';

/**
 * List all achievements with optional game filter.
 */
async function listAll() {
  return db(ACHIEVEMENT_TABLE)
    .select([
      'achievements.*',
      'games.slug as game_slug',
      'games.name as game_name',
    ])
    .leftJoin('games', 'achievements.game_id', 'games.id')
    .orderBy('achievements.created_at', 'asc');
}

/**
 * Find achievement by code.
 * @param {string} code
 */
async function findByCode(code) {
  return db(ACHIEVEMENT_TABLE).where({ code }).first();
}

/**
 * Find achievement by ID.
 * @param {string} id
 */
async function findById(id) {
  return db(ACHIEVEMENT_TABLE).where({ id }).first();
}

/**
 * Get user's earned achievements.
 * @param {string} userId
 */
async function listUserAchievements(userId) {
  return db(USER_ACHIEVEMENT_TABLE)
    .where({ user_id: userId })
    .select([
      'user_achievements.*',
      'achievements.code',
      'achievements.name',
      'achievements.description',
      'achievements.icon',
      'achievements.game_id',
      'games.slug as game_slug',
      'games.name as game_name',
    ])
    .join('achievements', 'user_achievements.achievement_id', 'achievements.id')
    .leftJoin('games', 'achievements.game_id', 'games.id')
    .orderBy('user_achievements.earned_at', 'desc');
}

/**
 * Check if a user already has an achievement.
 * @param {string} userId
 * @param {string} achievementId
 */
async function userHasAchievement(userId, achievementId) {
  const row = await db(USER_ACHIEVEMENT_TABLE)
    .where({ user_id: userId, achievement_id: achievementId })
    .first();
  return !!row;
}

/**
 * Award an achievement to a user.
 * @param {string} userId
 * @param {string} achievementId
 */
async function awardToUser(userId, achievementId) {
  const [ua] = await db(USER_ACHIEVEMENT_TABLE)
    .insert({ user_id: userId, achievement_id: achievementId })
    .returning('*');
  return ua;
}

/**
 * Get all achievements for a game.
 * @param {string} gameId
 */
async function listByGame(gameId) {
  return db(ACHIEVEMENT_TABLE)
    .where({ game_id: gameId })
    .orWhere({ game_id: null }) // include global achievements
    .select('*');
}

module.exports = {
  ACHIEVEMENT_TABLE,
  USER_ACHIEVEMENT_TABLE,
  listAll,
  findByCode,
  findById,
  listUserAchievements,
  userHasAchievement,
  awardToUser,
  listByGame,
};
