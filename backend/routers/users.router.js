const express = require('express');
const router = express.Router();
const UsersController = require('../controllers/users.controller');
const AchievementsController = require('../controllers/achievements.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');
const UsersValidator = require('../validators/users.validator');

// All user routes require authentication
router.use(authenticate);

// GET /api/v1/users/search
router.get('/search', UsersValidator.searchUsers, validate, UsersController.searchUsers);

// GET /api/v1/users/me/achievements (specific route before :id)
router.get('/me/achievements', AchievementsController.getUserAchievements);

// PATCH /api/v1/users/me
router.patch('/me', UsersValidator.updateProfile, validate, UsersController.updateProfile);

// PATCH /api/v1/users/me/password
router.patch('/me/password', UsersValidator.changePassword, validate, UsersController.changePassword);

// GET /api/v1/users/:id
router.get('/:id', UsersController.getUserById);

module.exports = router;
