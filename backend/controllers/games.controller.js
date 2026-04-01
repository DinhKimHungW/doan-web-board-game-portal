const GamesService = require('../services/games.service');
const { success, created } = require('../utils/response.utils');

/**
 * GET /games
 */
async function listGames(req, res, next) {
  try {
    const games = await GamesService.listGames();
    return success(res, { games });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /games/:slug
 */
async function getGameBySlug(req, res, next) {
  try {
    const game = await GamesService.getGameBySlug(req.params.slug);
    return success(res, { game });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /games/:slug/reviews
 */
async function getGameReviews(req, res, next) {
  try {
    const { results, my_review, pagination } = await GamesService.getGameReviews(
      req.params.slug,
      req.query,
      req.user?.id
    );
    return success(res, { reviews: results, my_review }, 200, pagination);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /games/:slug/reviews - create or update review
 */
async function upsertReview(req, res, next) {
  try {
    const { review, created: isNew } = await GamesService.upsertReview(
      req.params.slug,
      req.user.id,
      req.body
    );
    return isNew ? created(res, { review }) : success(res, { review });
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /games/:slug/reviews/:reviewId
 */
async function updateReview(req, res, next) {
  try {
    const review = await GamesService.updateReview(
      req.params.slug,
      req.params.reviewId,
      req.user.id,
      req.body
    );
    return success(res, { review });
  } catch (err) {
    next(err);
  }
}

module.exports = { listGames, getGameBySlug, getGameReviews, upsertReview, updateReview };
