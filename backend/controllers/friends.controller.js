const FriendsService = require('../services/friends.service');
const { success, created } = require('../utils/response.utils');

/**
 * GET /friends
 */
async function getFriends(req, res, next) {
  try {
    const friends = await FriendsService.getFriends(req.user.id);
    return success(res, { friends });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /friend-requests
 */
async function getFriendRequests(req, res, next) {
  try {
    const requests = await FriendsService.getFriendRequests(req.user.id);
    return success(res, { requests });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /friend-requests
 */
async function sendFriendRequest(req, res, next) {
  try {
    const { receiverId } = req.body;
    const request = await FriendsService.sendFriendRequest(req.user.id, receiverId);
    return created(res, { request });
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /friend-requests/:id/accept
 */
async function acceptFriendRequest(req, res, next) {
  try {
    const friendship = await FriendsService.acceptFriendRequest(req.params.id, req.user.id);
    return success(res, { friendship });
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /friend-requests/:id/reject
 */
async function rejectFriendRequest(req, res, next) {
  try {
    const friendship = await FriendsService.rejectFriendRequest(req.params.id, req.user.id);
    return success(res, { friendship });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /friends/:friendId
 */
async function removeFriend(req, res, next) {
  try {
    const result = await FriendsService.removeFriend(req.user.id, req.params.friendId);
    return success(res, result);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getFriends,
  getFriendRequests,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriend,
};
