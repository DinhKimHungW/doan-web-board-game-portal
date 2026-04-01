const AchievementModel = require('../models/achievement.model');
const FriendModel = require('../models/friend.model');
const db = require('../models/index');

/**
 * List all achievements.
 */
async function listAchievements() {
  return AchievementModel.listAll();
}

/**
 * Get achievements earned by a user.
 * @param {string} userId
 */
async function getUserAchievements(userId) {
  return AchievementModel.listUserAchievements(userId);
}

/**
 * Check and award achievements after a session is completed.
 * Called asynchronously after session completion.
 * @param {string} userId
 * @param {string} gameId
 * @param {{ score: number, result: string }} sessionData
 */
async function checkAndAwardAchievements(userId, gameId, { score, result }) {
  // Get all achievements relevant to this game + global ones
  const allAchievements = await AchievementModel.listAll();

  // Get user's current stats
  const globalStats = await db('user_game_stats')
    .where({ user_id: userId })
    .select([
      db.raw('SUM(total_plays)::int AS total_plays'),
      db.raw('SUM(wins)::int AS total_wins'),
    ])
    .first();

  const gameStats = await db('user_game_stats')
    .where({ user_id: userId, game_id: gameId })
    .first();

  const friendCount = await FriendModel.countFriends(userId);

  const newlyEarned = [];

  for (const achievement of allAchievements) {
    // Skip if already earned
    const alreadyHas = await AchievementModel.userHasAchievement(userId, achievement.id);
    if (alreadyHas) continue;

    // Skip game-specific achievements for wrong game
    if (achievement.game_id && achievement.game_id !== gameId) continue;

    const condition = achievement.condition_json;
    let earned = false;

    switch (condition.type) {
      case 'total_plays':
        earned = (globalStats.total_plays || 0) >= condition.value;
        break;

      case 'total_wins':
        earned = (globalStats.total_wins || 0) >= condition.value;
        break;

      case 'game_wins':
        earned = gameStats && gameStats.wins >= condition.value;
        break;

      case 'best_score':
        earned = gameStats && gameStats.best_score >= condition.value;
        break;

      case 'friend_count':
        earned = friendCount >= condition.value;
        break;

      case 'perfect_game':
        // perfect game logic would need additional tracking; skip for now
        // This would require the session to pass 'perfect: true' in its state
        break;

      default:
        break;
    }

    if (earned) {
      try {
        await AchievementModel.awardToUser(userId, achievement.id);
        newlyEarned.push(achievement);
      } catch (err) {
        // Ignore duplicate key errors (race condition protection)
        if (err.code !== '23505') throw err;
      }
    }
  }

  return newlyEarned;
}

module.exports = {
  listAchievements,
  getUserAchievements,
  checkAndAwardAchievements,
};
