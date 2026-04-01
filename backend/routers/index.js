const express = require('express');
const router = express.Router();

const authRouter = require('./auth.router');
const usersRouter = require('./users.router');
const friendsRouter = require('./friends.router');
const conversationsRouter = require('./conversations.router');
const gamesRouter = require('./games.router');
const gameSessionsRouter = require('./game-sessions.router');
const rankingsRouter = require('./rankings.router');
const achievementsRouter = require('./achievements.router');
const adminRouter = require('./admin.router');
const systemRouter = require('./system.router');

const { authenticate } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { body, param } = require('express-validator');
const FriendsController = require('../controllers/friends.controller');
const FriendsValidator = require('../validators/friends.validator');
const ConversationsController = require('../controllers/conversations.controller');

// ── Mount Routers ──────────────────────────────────────────────────────────────
router.use('/auth', authRouter);
router.use('/users', usersRouter);
router.use('/friends', friendsRouter);
router.use('/conversations', conversationsRouter);
router.use('/games', gamesRouter);
router.use('/game-sessions', gameSessionsRouter);
router.use('/rankings', rankingsRouter);
router.use('/achievements', achievementsRouter);
router.use('/admin', adminRouter);
router.use(systemRouter);

// ── Friend Requests (separate resource) ──────────────────────────────────────
// These sit at /api/v1/friend-requests to keep REST-ful resource naming
router.get('/friend-requests', authenticate, FriendsController.getFriendRequests);

router.post(
  '/friend-requests',
  authenticate,
  FriendsValidator.sendRequest,
  validate,
  FriendsController.sendFriendRequest
);

router.patch(
  '/friend-requests/:id/accept',
  authenticate,
  FriendsValidator.requestId,
  validate,
  FriendsController.acceptFriendRequest
);

router.patch(
  '/friend-requests/:id/reject',
  authenticate,
  FriendsValidator.requestId,
  validate,
  FriendsController.rejectFriendRequest
);

// ── Messages (standalone route for mark-as-read) ──────────────────────────────
router.patch('/messages/:id/read', authenticate, ConversationsController.markMessageRead);

module.exports = router;
