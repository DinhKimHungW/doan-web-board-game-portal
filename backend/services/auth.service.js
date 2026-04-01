const { v4: uuidv4 } = require('uuid');
const UserModel = require('../models/user.model');
const db = require('../models/index');
const { hashPassword, comparePassword, hashToken } = require('../utils/hash.utils');
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  getRefreshTokenExpiry,
} = require('../utils/jwt.utils');

const REFRESH_TABLE = 'refresh_tokens';

/**
 * Register a new user.
 * @param {{ name: string, email: string, password: string }} data
 */
async function register({ name, email, password }) {
  // Check if email already taken
  const existing = await UserModel.findByEmail(email);
  if (existing) {
    const err = new Error('An account with this email already exists.');
    err.status = 409;
    throw err;
  }

  const password_hash = await hashPassword(password);

  const user = await UserModel.create({ name, email, password_hash });
  return user;
}

/**
 * Login a user and issue tokens.
 * @param {{ email: string, password: string }} credentials
 * @returns {{ user: object, accessToken: string, refreshToken: string }}
 */
async function login({ email, password }) {
  const user = await UserModel.findByEmail(email);

  if (!user) {
    const err = new Error('Invalid email or password.');
    err.status = 401;
    throw err;
  }

  if (!user.is_active) {
    const err = new Error('Your account has been deactivated. Please contact support.');
    err.status = 403;
    throw err;
  }

  const passwordMatch = await comparePassword(password, user.password_hash);
  if (!passwordMatch) {
    const err = new Error('Invalid email or password.');
    err.status = 401;
    throw err;
  }

  const { accessToken, refreshToken } = await _issueTokenPair(user, uuidv4());

  // Strip password from user object
  const { password_hash, ...safeUser } = user;
  return { user: safeUser, accessToken, refreshToken };
}

/**
 * Refresh access token using refresh token.
 * Implements token rotation with family-based reuse detection.
 * @param {string} refreshToken
 * @returns {{ accessToken: string, refreshToken: string }}
 */
async function refreshTokens(refreshToken) {
  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch (err) {
    const e = new Error('Invalid or expired refresh token.');
    e.status = 401;
    throw e;
  }

  const tokenHash = hashToken(refreshToken);

  // Find the token in DB
  const storedToken = await db(REFRESH_TABLE)
    .where({ token_hash: tokenHash, user_id: payload.id })
    .first();

  if (!storedToken) {
    // Token not found - possible reuse attack; revoke entire family
    await db(REFRESH_TABLE).where({ family: payload.family }).update({
      is_revoked: true,
      revoked_at: db.fn.now(),
    });
    const err = new Error('Refresh token not recognized. Please log in again.');
    err.status = 401;
    throw err;
  }

  if (storedToken.is_revoked) {
    // Token was already used - reuse attack detected; revoke entire family
    await db(REFRESH_TABLE).where({ family: storedToken.family }).update({
      is_revoked: true,
      revoked_at: db.fn.now(),
    });
    const err = new Error('Refresh token reuse detected. All sessions have been revoked for security. Please log in again.');
    err.status = 401;
    throw err;
  }

  // Revoke the current token (rotation)
  await db(REFRESH_TABLE).where({ id: storedToken.id }).update({
    is_revoked: true,
    revoked_at: db.fn.now(),
  });

  // Get the user
  const user = await UserModel.findById(payload.id);
  if (!user || !user.is_active) {
    const err = new Error('User account not found or deactivated.');
    err.status = 401;
    throw err;
  }

  // Issue new token pair in the same family
  const { accessToken, refreshToken: newRefreshToken } = await _issueTokenPair(
    user,
    storedToken.family
  );

  return { accessToken, refreshToken: newRefreshToken };
}

/**
 * Logout: revoke a refresh token.
 * @param {string} refreshToken
 */
async function logout(refreshToken) {
  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    // Even if the token is expired/invalid, treat logout as success
    return;
  }

  const tokenHash = hashToken(refreshToken);
  await db(REFRESH_TABLE).where({ token_hash: tokenHash }).update({
    is_revoked: true,
    revoked_at: db.fn.now(),
  });
}

/**
 * Get current user profile.
 * @param {string} userId
 */
async function getMe(userId) {
  const user = await UserModel.findById(userId);
  if (!user) {
    const err = new Error('User not found.');
    err.status = 404;
    throw err;
  }
  return user;
}

// ── Internal helpers ──────────────────────────────────────────────────────────

async function _issueTokenPair(user, family) {
  const accessToken = signAccessToken({ id: user.id, email: user.email, role: user.role });
  const refreshToken = signRefreshToken({ id: user.id, family });

  const tokenHash = hashToken(refreshToken);
  const expiresAt = getRefreshTokenExpiry();

  await db(REFRESH_TABLE).insert({
    user_id: user.id,
    token_hash: tokenHash,
    family,
    expires_at: expiresAt,
    is_revoked: false,
  });

  return { accessToken, refreshToken };
}

module.exports = { register, login, refreshTokens, logout, getMe };
