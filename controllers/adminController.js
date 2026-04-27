/**
 * controllers/adminController.js — Admin authentication handlers
 */

'use strict';

const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

/**
 * signToken — Creates a signed JWT for an admin session.
 * @param {string} id — Admin's MongoDB ObjectId
 * @returns {string} Signed JWT
 */
function signToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

/**
 * POST /api/admin/login
 * Authenticates an admin user and returns a JWT.
 */
async function login(req, res, next) {
  try {
    const { username, password } = req.body;

    // Find admin by username; explicitly select password (excluded by default)
    const admin = await Admin.findOne({ username }).select('+password');
    if (!admin) {
      // Use generic message to prevent username enumeration
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const token = signToken(admin._id);

    res.json({
      message: 'Login successful.',
      token,
      admin: { username: admin.username, role: admin.role },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/admin/me
 * Returns the currently authenticated admin's info.
 */
async function getMe(req, res) {
  res.json({
    admin: { username: req.admin.username, role: req.admin.role },
  });
}

module.exports = { login, getMe };
