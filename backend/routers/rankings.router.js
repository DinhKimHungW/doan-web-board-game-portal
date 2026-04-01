const express = require('express');
const router = express.Router();
const RankingsController = require('../controllers/rankings.controller');
const { authenticate } = require('../middlewares/auth.middleware');

router.use(authenticate);

// GET /api/v1/rankings?game=<slug>&scope=global|friends|self&page=&limit=
router.get('/', RankingsController.getRankings);

module.exports = router;
