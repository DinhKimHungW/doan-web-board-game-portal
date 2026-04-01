const GameSessionModel = require('../models/game-session.model');
const GameModel = require('../models/game.model');
const RankingModel = require('../models/ranking.model');
const AchievementService = require('./achievements.service');
const db = require('../models/index');
const { parsePagination, buildPaginationMeta } = require('../utils/pagination.utils');

/**
 * Start a new game session.
 * @param {string} userId
 * @param {{ gameId: string, mode?: string, timerSetting?: number, boardRows?: number, boardCols?: number }} data
 */
async function startSession(userId, { gameId, mode, timerSetting, boardRows, boardCols }) {
  const game = await GameModel.findById(gameId);
  if (!game) {
    const err = new Error('Game not found.');
    err.status = 404;
    throw err;
  }
  if (!game.is_enabled) {
    const err = new Error('This game is currently unavailable.');
    err.status = 403;
    throw err;
  }

  const session = await GameSessionModel.create({
    user_id: userId,
    game_id: gameId,
    mode: mode || 'solo',
    status: 'IN_PROGRESS',
    timer_setting: timerSetting ?? game.default_time_limit,
    board_rows: boardRows ?? game.default_rows,
    board_cols: boardCols ?? game.default_cols,
    started_at: db.fn.now(),
  });

  return session;
}

/**
 * List sessions for a user.
 * @param {string} userId
 * @param {{ page?: number, limit?: number, status?: string }} query
 */
async function listSessions(userId, query) {
  const { page, limit, offset } = parsePagination(query);
  const { results, total } = await GameSessionModel.listByUser(userId, {
    limit,
    offset,
    status: query.status,
  });

  return {
    results,
    pagination: buildPaginationMeta({ page, limit, total }),
  };
}

/**
 * Get a session by ID (must belong to user).
 * @param {string} sessionId
 * @param {string} userId
 */
async function getSession(sessionId, userId) {
  const session = await GameSessionModel.findById(sessionId);
  if (!session) {
    const err = new Error('Session not found.');
    err.status = 404;
    throw err;
  }
  if (session.user_id !== userId) {
    const err = new Error('Access denied.');
    err.status = 403;
    throw err;
  }
  return session;
}

/**
 * Update game state (autosave during play).
 * @param {string} sessionId
 * @param {string} userId
 * @param {{ currentStateJson?: object, score?: number, elapsedSeconds?: number }} data
 */
async function updateState(sessionId, userId, { currentStateJson, score, elapsedSeconds }) {
  const session = await GameSessionModel.findById(sessionId);
  if (!session) {
    const err = new Error('Session not found.');
    err.status = 404;
    throw err;
  }
  if (session.user_id !== userId) {
    const err = new Error('Access denied.');
    err.status = 403;
    throw err;
  }
  if (session.status === 'FINISHED' || session.status === 'ABANDONED') {
    const err = new Error('Cannot update state of a completed or abandoned session.');
    err.status = 400;
    throw err;
  }

  const updates = {};
  if (currentStateJson !== undefined) updates.current_state_json = JSON.stringify(currentStateJson);
  if (score !== undefined) updates.score = score;
  if (elapsedSeconds !== undefined) updates.elapsed_seconds = elapsedSeconds;

  return GameSessionModel.updateState(sessionId, updates);
}

/**
 * Save game to a named slot.
 * @param {string} sessionId
 * @param {string} userId
 * @param {string} slotName
 */
async function saveGame(sessionId, userId, slotName) {
  const session = await GameSessionModel.findById(sessionId);
  if (!session) {
    const err = new Error('Session not found.');
    err.status = 404;
    throw err;
  }
  if (session.user_id !== userId) {
    const err = new Error('Access denied.');
    err.status = 403;
    throw err;
  }

  // Create save snapshot
  const [save] = await db('game_saves')
    .insert({
      session_id: sessionId,
      user_id: userId,
      slot_name: slotName,
      snapshot_json: session.current_state_json || {},
    })
    .returning('*');

  // Mark session as SAVED
  await GameSessionModel.markSaved(sessionId);

  return save;
}

/**
 * List saves for a session.
 * @param {string} sessionId
 * @param {string} userId
 */
async function listSaves(sessionId, userId) {
  const session = await GameSessionModel.findById(sessionId);
  if (!session) {
    const err = new Error('Session not found.');
    err.status = 404;
    throw err;
  }
  if (session.user_id !== userId) {
    const err = new Error('Access denied.');
    err.status = 403;
    throw err;
  }

  return db('game_saves')
    .where({ session_id: sessionId, user_id: userId })
    .orderBy('created_at', 'desc');
}

/**
 * Complete a session, update stats, check achievements.
 * @param {string} sessionId
 * @param {string} userId
 * @param {{ score: number, result: string }} data
 */
async function completeSession(sessionId, userId, { score, result }) {
  const session = await GameSessionModel.findById(sessionId);
  if (!session) {
    const err = new Error('Session not found.');
    err.status = 404;
    throw err;
  }
  if (session.user_id !== userId) {
    const err = new Error('Access denied.');
    err.status = 403;
    throw err;
  }
  if (session.status === 'FINISHED') {
    const err = new Error('Session is already completed.');
    err.status = 400;
    throw err;
  }

  // Complete the session
  const completed = await GameSessionModel.complete(sessionId, { score, result });

  // Update user game stats
  await RankingModel.upsertStats(userId, session.game_id, {
    score,
    result,
    elapsed_seconds: session.elapsed_seconds,
  });

  // Check and award achievements asynchronously (don't block response)
  AchievementService.checkAndAwardAchievements(userId, session.game_id, { score, result })
    .catch((err) => console.error('Achievement check failed:', err));

  return completed;
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
