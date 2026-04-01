const express = require('express');
const router = express.Router();
const GameSessionsController = require('../controllers/game-sessions.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');
const SessionValidator = require('../validators/game-sessions.validator');

router.use(authenticate);

// POST /api/v1/game-sessions
router.post('/', SessionValidator.createSession, validate, GameSessionsController.startSession);

// GET /api/v1/game-sessions
router.get('/', GameSessionsController.listSessions);

// GET /api/v1/game-sessions/:id
router.get('/:id', GameSessionsController.getSession);

// PATCH /api/v1/game-sessions/:id/state
router.patch('/:id/state', SessionValidator.updateState, validate, GameSessionsController.updateState);

// POST /api/v1/game-sessions/:id/save
router.post('/:id/save', SessionValidator.saveGame, validate, GameSessionsController.saveGame);

// GET /api/v1/game-sessions/:id/saves
router.get('/:id/saves', GameSessionsController.listSaves);

// POST /api/v1/game-sessions/:id/complete
router.post('/:id/complete', SessionValidator.completeSession, validate, GameSessionsController.completeSession);

module.exports = router;
