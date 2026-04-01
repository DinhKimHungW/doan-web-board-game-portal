const AdminService = require('../services/admin.service');
const { success } = require('../utils/response.utils');

/**
 * GET /admin/users
 */
async function listUsers(req, res, next) {
  try {
    const { results, pagination } = await AdminService.listUsers(req.query);
    return success(res, { users: results }, 200, pagination);
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /admin/users/:id
 */
async function updateUser(req, res, next) {
  try {
    const user = await AdminService.updateUser(req.params.id, req.body);
    return success(res, { user });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /admin/games
 */
async function listGames(req, res, next) {
  try {
    const games = await AdminService.listGames();
    return success(res, { games });
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /admin/games/:id
 */
async function updateGame(req, res, next) {
  try {
    const game = await AdminService.updateGame(req.params.id, req.body);
    return success(res, { game });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /admin/stats/overview
 */
async function getOverviewStats(req, res, next) {
  try {
    const stats = await AdminService.getOverviewStats();
    return success(res, { stats });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /admin/stats/games
 */
async function getGameStats(req, res, next) {
  try {
    const stats = await AdminService.getGameStats();
    return success(res, { stats });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /admin/stats/users
 */
async function getUserStats(req, res, next) {
  try {
    const stats = await AdminService.getUserStats();
    return success(res, { stats });
  } catch (err) {
    next(err);
  }
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
