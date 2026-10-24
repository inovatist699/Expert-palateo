'use strict';

// Keep legacy clients safe until registered OAuth and real app sessions are integrated.
module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json');
  if (['capacitor://localhost', 'https://localhost', 'https://palateo.in', 'https://www.palateo.in'].includes(req.headers.origin)) {
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    if (req.method === 'OPTIONS') return res.status(204).end();
  }
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'POST required' });
  }
  return res.status(503).json({
    code: 'TRUECALLER_UNAVAILABLE',
    error: 'Truecaller sign-in is unavailable. Please sign in with email.'
  });
};
