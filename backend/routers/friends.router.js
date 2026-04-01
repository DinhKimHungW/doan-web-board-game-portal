const express = require('express');
const router = express.Router();
const FriendsController = require('../controllers/friends.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');
const FriendsValidator = require('../validators/friends.validator');

router.use(authenticate);

// GET /api/v1/friends
router.get('/', FriendsController.getFriends);

// GET /api/v1/friend-requests  (mounted separately in index router)
// POST /api/v1/friend-requests
// PATCH /api/v1/friend-requests/:id/accept
// PATCH /api/v1/friend-requests/:id/reject
// DELETE /api/v1/friends/:friendId

// DELETE /api/v1/friends/:friendId
router.delete('/:friendId', FriendsValidator.friendId, validate, FriendsController.removeFriend);

module.exports = router;
