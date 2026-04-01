const express = require('express');
const router = express.Router();
const AchievementsController = require('../controllers/achievements.controller');
const { authenticate } = require('../middlewares/auth.middleware');

// GET /api/v1/achievements - public
router.get('/', AchievementsController.listAchievements);

// Note: GET /api/v1/users/me/achievements is handled in users.router.js
// to keep it under the /users namespace

module.exports = router;
