import express from 'express';
import handler from '../../src/server/api/truecaller.js';

const router = express.Router();
router.get('/.well-known/openid-configuration', (req, res) => { req.url = '/?action=discovery'; return handler(req, res); });
router.all('/', handler);
export default router;
