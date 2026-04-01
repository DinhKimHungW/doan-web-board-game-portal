const GameSessionsService = require('../services/game-sessions.service');
const { success, created } = require('../utils/response.utils');

/**
 * POST /game-sessions
 */
async function startSession(req, res, next) {
  try {
    const session = await GameSessionsService.startSession(req.user.id, req.body);
    return created(res, { session });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /game-sessions
 */
async function listSessions(req, res, next) {
  try {
    const { results, pagination } = await GameSessionsService.listSessions(req.user.id, req.query);
    return success(res, { sessions: results }, 200, pagination);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /game-sessions/:id
 */
async function getSession(req, res, next) {
  try {
    const session = await GameSessionsService.getSession(req.params.id, req.user.id);
    return success(res, { session });
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /game-sessions/:id/state
 */
async function updateState(req, res, next) {
  try {
    const session = await GameSessionsService.updateState(req.params.id, req.user.id, req.body);
    return success(res, { session });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /game-sessions/:id/save
 */
async function saveGame(req, res, next) {
  try {
    const save = await GameSessionsService.saveGame(req.params.id, req.user.id, req.body.slotName);
    return created(res, { save });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /game-sessions/:id/saves
 */
async function listSaves(req, res, next) {
  try {
    const saves = await GameSessionsService.listSaves(req.params.id, req.user.id);
    return success(res, { saves });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /game-sessions/:id/complete
 */
async function completeSession(req, res, next) {
  try {
    const session = await GameSessionsService.completeSession(req.params.id, req.user.id, req.body);
    return success(res, { session });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  startSession,
  listSessions,
  getSession,
  updateState,
  saveGame,
  listSaves,
  completeSession,
};
