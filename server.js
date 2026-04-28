/**
 * server.js — Main entry point for Asher Writes
 * Configures Express, middleware, routes, and DB connection.
 */

'use strict';

require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const path = require('path');

const connectDB = require('./models/db');
const articleRoutes = require('./routes/articleRoutes');
const adminRoutes = require('./routes/adminRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Trust proxy for Vercel (X-Forwarded-For header)
app.set('trust proxy', 1);

// ── Database ────────────────────────────────────────────────
connectDB();

// ── Security middleware ─────────────────────────────────────
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'fonts.googleapis.com'],
        fontSrc: ["'self'", 'fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:', 'https:'],
        scriptSrc: ["'self'", "'unsafe-inline'"], // Needed for inline scripts in HTML
      },
    },
  })
);

// Global rate limiter — 100 requests per 15 minutes per IP
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again later.' },
});
app.use(globalLimiter);

// Stricter rate limiter for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many login attempts. Please try again later.' },
});
app.use('/api/admin/login', authLimiter);

app.use(cors({ origin: process.env.ALLOWED_ORIGIN || '*' }));
app.use(express.json({ limit: '10kb' }));       // Cap request body size
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(mongoSanitize());                        // Strip MongoDB operators from user input

// ── Static files ────────────────────────────────────────────
// Cache strategy: HTML (no cache), CSS/JS/images (1 day)
app.use(express.static(path.join(__dirname, 'public'), { 
  maxAge: '1d',
  setHeaders: (res, path) => {
    // Don't cache HTML files (index.html, etc.)
    if (path.endsWith('.html')) {
      res.set('Cache-Control', 'public, max-age=0, must-revalidate');
    }
  }
}));

// ── API Routes ───────────────────────────────────────────────
app.use('/api/articles', articleRoutes);
app.use('/api/admin', adminRoutes);

// ── SPA / HTML fallback ─────────────────────────────────────
// All non-API GET requests are handled by the frontend router
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ── Global error handler ────────────────────────────────────
app.use(errorHandler);

// ── Start server (local dev; Vercel uses module export) ─────
const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`✅  Asher Writes running at http://localhost:${PORT}`);
  });
}

module.exports = app; // Required for Vercel serverless
