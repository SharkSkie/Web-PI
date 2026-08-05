// Vercel Serverless Function entry point
// This file routes all /api/* and /uploads/* requests to the Express app

const app = require('../backend/server');

module.exports = app;
