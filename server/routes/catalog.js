import express from 'express';
import { pool } from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const { city } = req.query;

  try {
    if (pool) {
      let queryText = 'SELECT * FROM public.restaurant_catalog';
      const params = [];
      if (city) {
        queryText += ' WHERE LOWER(city) = LOWER($1)';
        params.push(city);
      }
      queryText += ' ORDER BY rating DESC NULLS LAST, id ASC LIMIT 500';

      const result = await pool.query(queryText, params);
      return res.json({ data: result.rows, total: result.rowCount });
    }

    return res.json({ data: [], total: 0, note: 'Using client-side curated catalog in standalone mode' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;
