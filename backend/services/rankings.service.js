const GameModel = require('../models/game.model');
const FriendModel = require('../models/friend.model');
const RankingModel = require('../models/ranking.model');
const { parsePagination, buildPaginationMeta } = require('../utils/pagination.utils');

/**
 * Get rankings.
 * @param {{ game?: string, scope?: 'global'|'friends'|'self', page?: number, limit?: number }} query
 * @param {string} userId
 */
async function getRankings(query, userId) {
  const { game: gameSlug, scope = 'global' } = query;
  const { page, limit, offset } = parsePagination(query);

  // Require game slug for global/friends scope
  if (scope !== 'self' && !gameSlug) {
    const err = new Error('Game slug is required for global and friends rankings.');
    err.status = 400;
    throw err;
  }

  let gameId = null;
  let gameInfo = null;

  if (gameSlug) {
    gameInfo = await GameModel.findBySlug(gameSlug);
    if (!gameInfo) {
      const err = new Error('Game not found.');
      err.status = 404;
      throw err;
    }
    gameId = gameInfo.id;
  }

  let results, total;

  if (scope === 'global') {
    ({ results, total } = await RankingModel.getGlobalRankings(gameId, { limit, offset }));
  } else if (scope === 'friends') {
    const friendIds = await FriendModel.getFriendIds(userId);
    ({ results, total } = await RankingModel.getFriendRankings(gameId, userId, friendIds, {
      limit,
      offset,
    }));
  } else if (scope === 'self') {
    ({ results, total } = await RankingModel.getSelfRankings(userId, gameId, { limit, offset }));
  } else {
    const err = new Error('Invalid scope. Must be global, friends, or self.');
    err.status = 400;
    throw err;
  }

  return {
    game: gameInfo ? { id: gameInfo.id, slug: gameInfo.slug, name: gameInfo.name } : null,
    scope,
    results,
    pagination: buildPaginationMeta({ page, limit, total }),
  };
}

module.exports = { getRankings };
