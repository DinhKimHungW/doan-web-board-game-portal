const FriendModel = require('../models/friend.model');
const UserModel = require('../models/user.model');

/**
 * Get all accepted friends for the current user.
 * @param {string} userId
 */
async function getFriends(userId) {
  return FriendModel.listFriends(userId);
}

/**
 * Get pending friend requests (sent and received).
 * @param {string} userId
 */
async function getFriendRequests(userId) {
  return FriendModel.listPendingRequests(userId);
}

/**
 * Send a friend request.
 * @param {string} requesterId
 * @param {string} receiverId
 */
async function sendFriendRequest(requesterId, receiverId) {
  if (requesterId === receiverId) {
    const err = new Error('You cannot send a friend request to yourself.');
    err.status = 400;
    throw err;
  }

  // Check receiver exists and is active
  const receiver = await UserModel.findById(receiverId);
  if (!receiver || !receiver.is_active) {
    const err = new Error('User not found.');
    err.status = 404;
    throw err;
  }

  // Check for existing relationship
  const existing = await FriendModel.findBetween(requesterId, receiverId);
  if (existing) {
    if (existing.status === 'ACCEPTED') {
      const err = new Error('You are already friends with this user.');
      err.status = 409;
      throw err;
    }
    if (existing.status === 'PENDING') {
      const err = new Error('A friend request already exists between you and this user.');
      err.status = 409;
      throw err;
    }
    if (existing.status === 'REJECTED') {
      // Allow re-sending after rejection
      await FriendModel.updateStatus(existing.id, 'PENDING');
      return FriendModel.findById(existing.id);
    }
  }

  return FriendModel.create({ requester_id: requesterId, receiver_id: receiverId });
}

/**
 * Accept a friend request.
 * @param {string} requestId
 * @param {string} userId - the user accepting (must be the receiver)
 */
async function acceptFriendRequest(requestId, userId) {
  const request = await FriendModel.findById(requestId);

  if (!request) {
    const err = new Error('Friend request not found.');
    err.status = 404;
    throw err;
  }

  if (request.receiver_id !== userId) {
    const err = new Error('You can only accept friend requests sent to you.');
    err.status = 403;
    throw err;
  }

  if (request.status !== 'PENDING') {
    const err = new Error(`Cannot accept a request with status "${request.status}".`);
    err.status = 400;
    throw err;
  }

  return FriendModel.updateStatus(requestId, 'ACCEPTED');
}

/**
 * Reject a friend request.
 * @param {string} requestId
 * @param {string} userId - must be the receiver
 */
async function rejectFriendRequest(requestId, userId) {
  const request = await FriendModel.findById(requestId);

  if (!request) {
    const err = new Error('Friend request not found.');
    err.status = 404;
    throw err;
  }

  if (request.receiver_id !== userId) {
    const err = new Error('You can only reject friend requests sent to you.');
    err.status = 403;
    throw err;
  }

  if (request.status !== 'PENDING') {
    const err = new Error(`Cannot reject a request with status "${request.status}".`);
    err.status = 400;
    throw err;
  }

  return FriendModel.updateStatus(requestId, 'REJECTED');
}

/**
 * Remove a friend (unfriend).
 * @param {string} userId
 * @param {string} friendId
 */
async function removeFriend(userId, friendId) {
  const friendship = await FriendModel.findBetween(userId, friendId);

  if (!friendship || friendship.status !== 'ACCEPTED') {
    const err = new Error('Friendship not found.');
    err.status = 404;
    throw err;
  }

  await FriendModel.remove(friendship.id);
  return { message: 'Friend removed successfully.' };
}

module.exports = {
  getFriends,
  getFriendRequests,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriend,
};
