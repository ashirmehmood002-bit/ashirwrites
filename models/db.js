/**
 * models/db.js — MongoDB connection via Mongoose
 */

'use strict';

const mongoose = require('mongoose');

let isConnected = false;

/**
 * connectDB — Connects to MongoDB.
 * Caches the connection so serverless functions don't re-connect on every invocation.
 */
async function connectDB() {
  if (isConnected) return;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌  MONGODB_URI is not defined in environment variables.');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log('✅  MongoDB connected.');
  } catch (err) {
    console.error('❌  MongoDB connection error:', err.message);
    process.exit(1);
  }
}

module.exports = connectDB;
