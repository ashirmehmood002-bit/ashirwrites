/**
 * controllers/articleController.js — CRUD handlers for articles
 */

'use strict';

const Article = require('../models/Article');

/** GET /api/articles — List all published articles (newest first) */
async function listArticles(req, res, next) {
  try {
    const articles = await Article.find({ published: true })
      .select('title slug description coverImage tags createdAt')
      .sort({ createdAt: -1 })
      .lean();

    res.json({ count: articles.length, articles });
  } catch (err) {
    next(err);
  }
}

/** GET /api/articles/all — List ALL articles including drafts (admin only) */
async function listAllArticles(req, res, next) {
  try {
    const articles = await Article.find()
      .select('title slug description coverImage tags published createdAt')
      .sort({ createdAt: -1 })
      .lean();

    res.json({ count: articles.length, articles });
  } catch (err) {
    next(err);
  }
}

/** GET /api/articles/:slug — Get single article by slug */
async function getArticle(req, res, next) {
  try {
    const article = await Article.findOne({
      slug: req.params.slug,
      published: true,
    }).lean();

    if (!article) {
      const err = new Error('Article not found.');
      err.statusCode = 404;
      return next(err);
    }

    res.json({ article });
  } catch (err) {
    next(err);
  }
}

/** GET /api/articles/id/:id — Get single article by ID (admin) */
async function getArticleById(req, res, next) {
  try {
    const article = await Article.findById(req.params.id).lean();
    if (!article) {
      const err = new Error('Article not found.');
      err.statusCode = 404;
      return next(err);
    }
    res.json({ article });
  } catch (err) {
    next(err);
  }
}

/** POST /api/articles — Create a new article (admin only) */
async function createArticle(req, res, next) {
  try {
    const { title, description, content, coverImage, tags, published } = req.body;

    const article = await Article.create({
      title,
      description,
      content,
      coverImage: coverImage || '',
      tags: Array.isArray(tags) ? tags : [],
      published: published !== undefined ? published : true,
    });

    res.status(201).json({ message: 'Article created.', article });
  } catch (err) {
    next(err);
  }
}

/** PUT /api/articles/:id — Update an article (admin only) */
async function updateArticle(req, res, next) {
  try {
    const { title, description, content, coverImage, tags, published } = req.body;

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (content !== undefined) updateData.content = content;
    if (coverImage !== undefined) updateData.coverImage = coverImage;
    if (tags !== undefined) updateData.tags = Array.isArray(tags) ? tags : [];
    if (published !== undefined) updateData.published = published;

    const article = await Article.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!article) {
      const err = new Error('Article not found.');
      err.statusCode = 404;
      return next(err);
    }

    res.json({ message: 'Article updated.', article });
  } catch (err) {
    next(err);
  }
}

/** DELETE /api/articles/:id — Delete an article (admin only) */
async function deleteArticle(req, res, next) {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);

    if (!article) {
      const err = new Error('Article not found.');
      err.statusCode = 404;
      return next(err);
    }

    res.json({ message: 'Article deleted.' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listArticles,
  listAllArticles,
  getArticle,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
};
