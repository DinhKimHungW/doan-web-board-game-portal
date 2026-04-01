const UsersService = require('../services/users.service');
const { success } = require('../utils/response.utils');

/**
 * GET /users/search?q=&page=&limit=
 */
async function searchUsers(req, res, next) {
  try {
    const { results, pagination } = await UsersService.searchUsers(req.query);
    return success(res, { users: results }, 200, pagination);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /users/:id
 */
async function getUserById(req, res, next) {
  try {
    const user = await UsersService.getUserById(req.params.id);
    return success(res, { user });
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /users/me
 */
async function updateProfile(req, res, next) {
  try {
    const user = await UsersService.updateProfile(req.user.id, req.body);
    return success(res, { user });
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /users/me/password
 */
async function changePassword(req, res, next) {
  try {
    const result = await UsersService.changePassword(req.user.id, req.body);
    return success(res, result);
  } catch (err) {
    next(err);
  }
}

module.exports = { searchUsers, getUserById, updateProfile, changePassword };
