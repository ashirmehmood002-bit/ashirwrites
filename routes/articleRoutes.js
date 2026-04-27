/**
 * routes/articleRoutes.js — Public and protected article API routes
 */

'use strict';

const express = require('express');
const router = express.Router();

const {
  listArticles,
  listAllArticles,
  getArticle,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
} = require('../controllers/articleController');

const { protect } = require('../middleware/auth');
const { validateArticle } = require('../middleware/validate');

// ── Public routes ────────────────────────────────────────────
router.get('/', listArticles);                      // All published articles
router.get('/slug/:slug', getArticle);              // Single article by slug

// ── Protected routes (admin only) ───────────────────────────
router.use(protect);                                // All routes below require auth

router.get('/all', listAllArticles);                // All articles incl. drafts
router.get('/id/:id', getArticleById);              // Single article by ID
router.post('/', validateArticle, createArticle);   // Create
router.put('/:id', validateArticle, updateArticle); // Update
router.delete('/:id', deleteArticle);               // Delete

module.exports = router;
