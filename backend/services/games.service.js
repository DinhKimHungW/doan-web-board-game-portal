const GameModel = require('../models/game.model');
const db = require('../models/index');
const { parsePagination, buildPaginationMeta } = require('../utils/pagination.utils');

/**
 * List all enabled games.
 */
async function listGames() {
  return GameModel.listEnabled();
}

/**
 * Get a game by slug with avg rating.
 * @param {string} slug
 */
async function getGameBySlug(slug) {
  const game = await GameModel.findBySlug(slug);
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
  return game;
}

/**
 * Get reviews for a game with pagination.
 * @param {string} slug
 * @param {{ page?: number, limit?: number }} query
 * @param {string} [currentUserId]
 */
async function getGameReviews(slug, query, currentUserId) {
  const game = await GameModel.findBySlug(slug);
  if (!game) {
    const err = new Error('Game not found.');
    err.status = 404;
    throw err;
  }

  const { page, limit, offset } = parsePagination(query, { defaultLimit: 10, maxLimit: 50 });

  const results = await db('game_reviews')
    .where({ 'game_reviews.game_id': game.id })
    .select([
      'game_reviews.*',
      'users.name as user_name',
      'users.avatar_url as user_avatar',
    ])
    .join('users', 'game_reviews.user_id', 'users.id')
    .orderBy('game_reviews.created_at', 'desc')
    .limit(limit)
    .offset(offset);

  const [{ count }] = await db('game_reviews')
    .where({ game_id: game.id })
    .count('id as count');

  let myReview = null;
  if (currentUserId) {
    myReview = await db('game_reviews')
      .where({ game_id: game.id, user_id: currentUserId })
      .first();
  }

  return {
    results,
    my_review: myReview,
    pagination: buildPaginationMeta({ page, limit, total: parseInt(count, 10) }),
  };
}

/**
 * Create or update a review.
 * @param {string} slug
 * @param {string} userId
 * @param {{ rating: number, comment?: string }} data
 */
async function upsertReview(slug, userId, { rating, comment }) {
  const game = await GameModel.findBySlug(slug);
  if (!game) {
    const err = new Error('Game not found.');
    err.status = 404;
    throw err;
  }

  const existing = await db('game_reviews')
    .where({ user_id: userId, game_id: game.id })
    .first();

  if (existing) {
    const [updated] = await db('game_reviews')
      .where({ id: existing.id })
      .update({ rating, comment: comment ?? null, updated_at: db.fn.now() })
      .returning('*');
    return { review: updated, created: false };
  }

  const [created] = await db('game_reviews')
    .insert({ user_id: userId, game_id: game.id, rating, comment: comment ?? null })
    .returning('*');
  return { review: created, created: true };
}

/**
 * Update an existing review.
 * @param {string} slug
 * @param {string} reviewId
 * @param {string} userId
 * @param {{ rating?: number, comment?: string }} data
 */
async function updateReview(slug, reviewId, userId, { rating, comment }) {
  const game = await GameModel.findBySlug(slug);
  if (!game) {
    const err = new Error('Game not found.');
    err.status = 404;
    throw err;
  }

  const review = await db('game_reviews').where({ id: reviewId }).first();
  if (!review) {
    const err = new Error('Review not found.');
    err.status = 404;
    throw err;
  }

  if (review.user_id !== userId) {
    const err = new Error('You can only edit your own reviews.');
    err.status = 403;
    throw err;
  }

  const updates = {};
  if (rating !== undefined) updates.rating = rating;
  if (comment !== undefined) updates.comment = comment;
  updates.updated_at = db.fn.now();

  const [updated] = await db('game_reviews')
    .where({ id: reviewId })
    .update(updates)
    .returning('*');

  return updated;
}

module.exports = {
  listGames,
  getGameBySlug,
  getGameReviews,
  upsertReview,
  updateReview,
};
