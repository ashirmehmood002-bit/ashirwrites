/**
 * middleware/validate.js — Input validation helpers
 * Validates and sanitizes incoming request bodies.
 */

'use strict';

/**
 * Strip potentially dangerous HTML tags from a string.
 * This is a lightweight sanitizer; for production with user-generated HTML
 * consider a library like DOMPurify (server-side via jsdom) or sanitize-html.
 */
function stripTags(str) {
  if (typeof str !== 'string') return str;
  // Allow basic formatting tags in article content; strip script/iframe/object
  return str.replace(/<(script|iframe|object|embed|form)[^>]*>[\s\S]*?<\/\1>/gi, '');
}

/**
 * validateArticle — Validates article create/update payloads.
 * Returns a 422 with an array of errors if validation fails.
 */
function validateArticle(req, res, next) {
  const errors = [];
  const { title, description, content } = req.body;

  if (!title || typeof title !== 'string' || title.trim().length < 3) {
    errors.push('Title must be at least 3 characters.');
  }
  if (title && title.trim().length > 200) {
    errors.push('Title cannot exceed 200 characters.');
  }
  if (!description || typeof description !== 'string' || description.trim().length < 10) {
    errors.push('Description must be at least 10 characters.');
  }
  if (description && description.trim().length > 500) {
    errors.push('Description cannot exceed 500 characters.');
  }
  if (!content || typeof content !== 'string' || content.trim().length < 20) {
    errors.push('Content must be at least 20 characters.');
  }

  if (errors.length > 0) {
    return res.status(422).json({ errors });
  }

  // Sanitize fields
  req.body.title = title.trim();
  req.body.description = description.trim();
  req.body.content = stripTags(content);

  next();
}

/**
 * validateLogin — Validates admin login payload.
 */
function validateLogin(req, res, next) {
  const errors = [];
  const { username, password } = req.body;

  if (!username || typeof username !== 'string' || username.trim().length < 2) {
    errors.push('Username is required.');
  }
  if (!password || typeof password !== 'string' || password.length < 6) {
    errors.push('Password must be at least 6 characters.');
  }

  if (errors.length > 0) {
    return res.status(422).json({ errors });
  }

  req.body.username = username.trim().toLowerCase();
  next();
}

module.exports = { validateArticle, validateLogin };
