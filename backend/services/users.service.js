const UserModel = require('../models/user.model');
const { hashPassword, comparePassword } = require('../utils/hash.utils');
const { parsePagination, buildPaginationMeta } = require('../utils/pagination.utils');

/**
 * Search users by name or email.
 * @param {{ q?: string, page?: number, limit?: number }} query
 */
async function searchUsers(query) {
  const { page, limit, offset } = parsePagination(query);
  const searchQuery = query.q || '';

  const { results, total } = await UserModel.search(searchQuery, { limit, offset });
  return {
    results,
    pagination: buildPaginationMeta({ page, limit, total }),
  };
}

/**
 * Get a user's public profile by ID.
 * @param {string} id
 */
async function getUserById(id) {
  const user = await UserModel.findById(id);
  if (!user) {
    const err = new Error('User not found.');
    err.status = 404;
    throw err;
  }
  if (!user.is_active) {
    const err = new Error('This user account is not active.');
    err.status = 404;
    throw err;
  }
  return user;
}

/**
 * Update authenticated user's own profile.
 * @param {string} userId
 * @param {{ name?: string, bio?: string, avatar_url?: string, theme_preference?: string }} data
 */
async function updateProfile(userId, data) {
  const allowedFields = ['name', 'bio', 'avatar_url', 'theme_preference'];
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

  const updated = await UserModel.update(userId, updateData);
  return updated;
}

/**
 * Change user's password.
 * @param {string} userId
 * @param {{ currentPassword: string, newPassword: string }} data
 */
async function changePassword(userId, { currentPassword, newPassword }) {
  // Fetch user with password hash
  const user = await UserModel.findByEmail(
    (await UserModel.findById(userId)).email
  );

  const match = await comparePassword(currentPassword, user.password_hash);
  if (!match) {
    const err = new Error('Current password is incorrect.');
    err.status = 400;
    throw err;
  }

  if (currentPassword === newPassword) {
    const err = new Error('New password must be different from current password.');
    err.status = 400;
    throw err;
  }

  const newHash = await hashPassword(newPassword);
  await UserModel.update(userId, { password_hash: newHash });

  return { message: 'Password changed successfully.' };
}

module.exports = { searchUsers, getUserById, updateProfile, changePassword };
