import express from 'express';
import { getAuthUser } from '../auth.js';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

const router = express.Router();
const paloHandler = require('../../src/server/api/palo.js');

router.post('/', async (req, res) => {
  try {
    const user=await getAuthUser(req);
    await paloHandler(req, res, user);
  } catch (err) {
    console.error('[Palo API] error:', err);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Palo service temporarily unavailable' });
    }
  }
});

export default router;
