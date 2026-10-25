import express from 'express';
import handler from '../../src/server/api/truecaller.js';

const router = express.Router();
router.all('/', handler);
export default router;
