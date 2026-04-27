/**
 * models/Admin.js — Mongoose schema for admin users
 * Passwords are hashed with bcrypt before storage.
 */

'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required.'],
      unique: true,
      lowercase: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters.'],
      maxlength: [30, 'Username cannot exceed 30 characters.'],
    },
    password: {
      type: String,
      required: [true, 'Password is required.'],
      minlength: [8, 'Password must be at least 8 characters.'],
      select: false, // Never return password in query results by default
    },
    role: {
      type: String,
      enum: ['admin'],
      default: 'admin',
    },
  },
  { timestamps: true }
);

// ── Hash password before saving ─────────────────────────────
adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

/**
 * comparePassword — Verifies a plain-text password against the stored hash.
 * @param {string} candidatePassword
 * @returns {Promise<boolean>}
 */
adminSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Admin', adminSchema);
