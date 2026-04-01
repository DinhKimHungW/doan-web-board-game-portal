const express = require('express');
const router = express.Router();
const GamesController = require('../controllers/games.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');
const GamesValidator = require('../validators/games.validator');

// GET /api/v1/games - public
router.get('/', GamesController.listGames);

// GET /api/v1/games/:slug - public, but pass user if authenticated
router.get('/:slug', GamesController.getGameBySlug);

// GET /api/v1/games/:slug/reviews - public + my_review if authenticated
router.get('/:slug/reviews', (req, res, next) => {
  // Optionally populate req.user if token is present (but don't require it)
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const { verifyAccessToken } = require('../utils/jwt.utils');
    try {
      const token = authHeader.split(' ')[1];
      req.user = verifyAccessToken(token);
    } catch {
      // ignore invalid tokens for public routes
    }
  }
  next();
}, GamesValidator.listReviews, validate, GamesController.getGameReviews);

// POST /api/v1/games/:slug/reviews - requires auth
router.post('/:slug/reviews', authenticate, GamesValidator.createReview, validate, GamesController.upsertReview);

// PATCH /api/v1/games/:slug/reviews/:reviewId - requires auth
router.patch('/:slug/reviews/:reviewId', authenticate, GamesValidator.updateReview, validate, GamesController.updateReview);

module.exports = router;
