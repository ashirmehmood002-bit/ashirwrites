/**
 * middleware/auth.js — JWT authentication middleware
 * Verifies the Bearer token on protected admin API routes.
 */

'use strict';

const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

/**
 * protect — Express middleware that validates a JWT from the Authorization header.
 * Attaches the decoded admin object to req.admin.
 */
async function protect(req, res, next) {
  try {
    // 1. Extract token from Authorization: Bearer <token>
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication required. Please log in.' });
    }

    const token = authHeader.split(' ')[1];

    // 2. Verify token signature and expiry
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Session expired. Please log in again.' });
      }
      return res.status(401).json({ error: 'Invalid token. Please log in again.' });
    }

    // 3. Confirm the admin still exists in the database
    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return res.status(401).json({ error: 'Account no longer exists.' });
    }

    // 4. Attach admin to request for downstream handlers
    req.admin = admin;
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = { protect };
