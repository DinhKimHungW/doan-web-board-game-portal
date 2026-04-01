const AchievementsService = require('../services/achievements.service');
const { success } = require('../utils/response.utils');

/**
 * GET /achievements
 */
async function listAchievements(req, res, next) {
  try {
    const achievements = await AchievementsService.listAchievements();
    return success(res, { achievements });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /users/me/achievements
 */
async function getUserAchievements(req, res, next) {
  try {
    const achievements = await AchievementsService.getUserAchievements(req.user.id);
    return success(res, { achievements });
  } catch (err) {
    next(err);
  }
}

module.exports = { listAchievements, getUserAchievements };
