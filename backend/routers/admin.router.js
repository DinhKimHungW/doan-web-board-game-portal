const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/admin.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { requireAdmin } = require('../middlewares/admin.middleware');
const { validate } = require('../middlewares/validate.middleware');
const AdminValidator = require('../validators/admin.validator');

// All admin routes require authentication + admin role
router.use(authenticate, requireAdmin);

// GET /api/v1/admin/users
router.get('/users', AdminValidator.listUsers, validate, AdminController.listUsers);

// PATCH /api/v1/admin/users/:id
router.patch('/users/:id', AdminValidator.updateUser, validate, AdminController.updateUser);

// GET /api/v1/admin/games
router.get('/games', AdminController.listGames);

// PATCH /api/v1/admin/games/:id
router.patch('/games/:id', AdminValidator.updateGame, validate, AdminController.updateGame);

// GET /api/v1/admin/stats/overview
router.get('/stats/overview', AdminController.getOverviewStats);

// GET /api/v1/admin/stats/games
router.get('/stats/games', AdminController.getGameStats);

// GET /api/v1/admin/stats/users
router.get('/stats/users', AdminController.getUserStats);

module.exports = router;
