/**
 * routes/adminRoutes.js — Admin authentication routes
 */

'use strict';

const express = require('express');
const router = express.Router();

const { login, getMe } = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { validateLogin } = require('../middleware/validate');

// POST /api/admin/login — Public: authenticate and get JWT
router.post('/login', validateLogin, login);

// GET /api/admin/me — Protected: verify token and return admin info
router.get('/me', protect, getMe);

module.exports = router;
