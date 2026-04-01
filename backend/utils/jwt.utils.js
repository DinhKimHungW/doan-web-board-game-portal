const jwt = require('jsonwebtoken');

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'dev_access_secret_change_me';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret_change_me';
const ACCESS_EXPIRES = process.env.JWT_ACCESS_EXPIRES_IN || '15m';
const REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

/**
 * Sign an access token (short-lived).
 * @param {{ id: string, email: string, role: string }} payload
 * @returns {string}
 */
function signAccessToken(payload) {
  return jwt.sign(
    { id: payload.id, email: payload.email, role: payload.role },
    ACCESS_SECRET,
    { expiresIn: ACCESS_EXPIRES }
  );
}

/**
 * Sign a refresh token (long-lived).
 * @param {{ id: string, family: string }} payload
 * @returns {string}
 */
function signRefreshToken(payload) {
  return jwt.sign(
    { id: payload.id, family: payload.family },
    REFRESH_SECRET,
    { expiresIn: REFRESH_EXPIRES }
  );
}

/**
 * Verify an access token.
 * @param {string} token
 * @returns {{ id: string, email: string, role: string, iat: number, exp: number }}
 */
function verifyAccessToken(token) {
  return jwt.verify(token, ACCESS_SECRET);
}

/**
 * Verify a refresh token.
 * @param {string} token
 * @returns {{ id: string, family: string, iat: number, exp: number }}
 */
function verifyRefreshToken(token) {
  return jwt.verify(token, REFRESH_SECRET);
}

/**
 * Decode token without verification (e.g. for logging).
 * @param {string} token
 */
function decodeToken(token) {
  return jwt.decode(token);
}

/**
 * Get refresh token expiry date as a Date object.
 * @returns {Date}
 */
function getRefreshTokenExpiry() {
  const days = parseInt(REFRESH_EXPIRES, 10) || 7;
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  decodeToken,
  getRefreshTokenExpiry,
};
