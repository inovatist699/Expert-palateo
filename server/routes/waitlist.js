import express from 'express';
import { pool, memStore } from '../db.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { email, city, consent } = req.body || {};

  const cleanEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
  const ALLOWED_CITIES = ['Ahmedabad', 'Vadodara', 'Mumbai', 'Delhi', 'Bengaluru', 'Pune', 'Other'];

  if (!cleanEmail || cleanEmail.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail) || !ALLOWED_CITIES.includes(city) || consent !== true) {
    return res.status(400).json({ error: 'Valid email, city, and consent required' });
  }

  try {
    if (pool) {
      await pool.query(
        'INSERT INTO public.launch_waitlist (email, city, consent, created_at) VALUES ($1, $2, $3, NOW()) ON CONFLICT (email) DO UPDATE SET city = EXCLUDED.city, updated_at = NOW()',
        [cleanEmail, city, true]
      );
    } else {
      memStore.waitlist.set(cleanEmail, { email: cleanEmail, city, consent: true, created_at: new Date().toISOString() });
    }

    // Optional email dispatch with Resend if API key is configured
    if (process.env.RESEND_API_KEY && !cleanEmail.endsWith('.invalid')) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: 'Palateo <hello@updates.palateo.in>',
            to: [cleanEmail],
            reply_to: 'palateo.com@gmail.com',
            subject: 'Your seat at Palateo is saved',
            text: `You are on the Palateo waitlist for ${city}. We will email you when access opens.\n\nAayush Mittal · Palateo`
          }),
          signal: AbortSignal.timeout(5000)
        });
      } catch (mailErr) {
        console.warn('[Waitlist] Resend email warning:', mailErr.message);
      }
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[Waitlist] Submission error:', err);
    return res.status(500).json({ error: 'Waitlist temporarily unavailable' });
  }
});

export default router;
