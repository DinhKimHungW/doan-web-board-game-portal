const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');
const AuthValidator = require('../validators/auth.validator');

// POST /api/v1/auth/register
router.post('/register', AuthValidator.register, validate, AuthController.register);

// POST /api/v1/auth/login
router.post('/login', AuthValidator.login, validate, AuthController.login);

// POST /api/v1/auth/refresh
router.post('/refresh', AuthValidator.refresh, validate, AuthController.refresh);

// POST /api/v1/auth/logout
router.post('/logout', AuthValidator.logout, validate, AuthController.logout);

// GET /api/v1/auth/me
router.get('/me', authenticate, AuthController.getMe);

module.exports = router;
