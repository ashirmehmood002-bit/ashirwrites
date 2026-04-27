/**
 * middleware/errorHandler.js — Centralized error handling middleware
 * Must be registered LAST in Express middleware chain.
 */

'use strict';

/**
 * errorHandler — Catches all errors passed via next(err) and returns
 * a consistent JSON error response. Never leaks stack traces in production.
 */
function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  const isDev = process.env.NODE_ENV === 'development';

  // Default to 500 if status not set
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal server error.';

  // Log full error in development; minimal in production
  if (isDev) {
    console.error(`[ERROR] ${statusCode} ${req.method} ${req.path}`);
    console.error(err.stack);
  } else if (statusCode >= 500) {
    console.error(`[ERROR] ${statusCode} — ${message}`);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => e.message);
    return res.status(422).json({ errors });
  }

  // Mongoose duplicate key error (e.g. duplicate slug)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return res.status(409).json({ error: `Duplicate value for ${field}.` });
  }

  // Mongoose CastError (bad ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({ error: 'Invalid ID format.' });
  }

  res.status(statusCode).json({
    error: message,
    ...(isDev && { stack: err.stack }),
  });
}

module.exports = errorHandler;
