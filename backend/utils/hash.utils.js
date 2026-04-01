const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const ROUNDS = parseInt(process.env.BCRYPT_ROUNDS || '12', 10);

/**
 * Hash a plain-text password.
 * @param {string} password
 * @returns {Promise<string>}
 */
async function hashPassword(password) {
  return bcrypt.hash(password, ROUNDS);
}

/**
 * Compare a plain-text password against a hash.
 * @param {string} password
 * @param {string} hash
 * @returns {Promise<boolean>}
 */
async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

/**
 * Hash a refresh token using SHA-256 for DB storage.
 * This allows constant-time comparison without bcrypt overhead on every request.
 * @param {string} token
 * @returns {string}
 */
function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

module.exports = {
  hashPassword,
  comparePassword,
  hashToken,
};
