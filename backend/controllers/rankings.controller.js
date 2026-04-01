const RankingsService = require('../services/rankings.service');
const { success } = require('../utils/response.utils');

/**
 * GET /rankings?game=<slug>&scope=global|friends|self&page=&limit=
 */
async function getRankings(req, res, next) {
  try {
    const data = await RankingsService.getRankings(req.query, req.user.id);
    return success(res, data, 200, data.pagination);
  } catch (err) {
    next(err);
  }
}

module.exports = { getRankings };
