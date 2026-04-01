const AuthService = require('../services/auth.service');
const { success, created, error } = require('../utils/response.utils');

/**
 * POST /auth/register
 */
async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    // Register user then auto-login to issue tokens
    await AuthService.register({ name, email, password });
    const { user, accessToken, refreshToken } = await AuthService.login({ email, password });
    return created(res, { user, accessToken, refreshToken });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /auth/login
 */
async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = await AuthService.login({ email, password });
    return success(res, { user, accessToken, refreshToken });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /auth/refresh
 */
async function refresh(req, res, next) {
  try {
    const { refreshToken } = req.body;
    const tokens = await AuthService.refreshTokens(refreshToken);
    return success(res, tokens);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /auth/logout
 */
async function logout(req, res, next) {
  try {
    const { refreshToken } = req.body;
    await AuthService.logout(refreshToken);
    return success(res, { message: 'Logged out successfully.' });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /auth/me
 */
async function getMe(req, res, next) {
  try {
    const user = await AuthService.getMe(req.user.id);
    return success(res, { user });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, refresh, logout, getMe };
