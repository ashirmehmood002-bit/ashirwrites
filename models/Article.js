/**
 * models/Article.js — Mongoose schema for articles
 */

'use strict';

const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required.'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters.'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Short description is required.'],
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters.'],
    },
    content: {
      type: String,
      required: [true, 'Content is required.'],
    },
    coverImage: {
      type: String,
      default: '',
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    published: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

// ── Auto-generate slug from title before saving ─────────────
articleSchema.pre('save', function (next) {
  if (this.isModified('title') || this.isNew) {
    this.slug = slugify(this.title);
  }
  next();
});

articleSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate();
  if (update.title) {
    update.slug = slugify(update.title);
  }
  next();
});

/**
 * slugify — Converts a title string to a URL-safe slug.
 * e.g. "Hello World!" → "hello-world"
 */
function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')   // Remove non-alphanumeric chars
    .replace(/\s+/g, '-')            // Replace spaces with hyphens
    .replace(/-+/g, '-')             // Collapse multiple hyphens
    .replace(/^-|-$/g, '');          // Trim leading/trailing hyphens
}

// Virtual: expose id as string (useful for frontend)
articleSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

articleSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Article', articleSchema);
