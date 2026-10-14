import express from 'express';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

const router = express.Router();
const searchHandler = require('../../src/server/api/search.js');

router.post('/', async (req, res) => {
  try {
    await searchHandler(req, res);
  } catch (err) {
    console.error('[Search API] error:', err);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Search service temporarily unavailable' });
    }
  }
});

export default router;
