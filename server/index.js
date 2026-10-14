import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './auth.js';
import { initializeSchema, pool } from './db.js';
import { allowedOrigins } from './runtime-config.js';
import userRouter from './routes/user.js';
import catalogRouter from './routes/catalog.js';
import waitlistRouter from './routes/waitlist.js';
import paloRouter from './routes/palo.js';
import searchRouter from './routes/search.js';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 3000);

// Allowed origins for CORS (Palateo production, staging, and local preview)


app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const match = allowedOrigins.some(item =>
      typeof item === 'string' ? item === origin : item.test(origin)
    );
    if (match) return callback(null, true);
    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'X-Requested-With']
}));

// Railway deployment health check
app.get('/health', async (req, res) => {
  try { if(pool) await pool.query('SELECT 1'); } catch { return res.status(503).json({status:'unavailable'}); }
  res.status(200).json({
    status: 'ok',
    service: 'palateo-backend',
    auth: 'better-auth',
    database: process.env.DATABASE_URL ? 'postgresql' : 'in-memory',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// IMPORTANT (Better Auth): Mount Better Auth handler BEFORE any JSON body parser
// In Express v5, wildcard parameters require the splat syntax (*splat)
app.all('/api/auth/*splat', toNodeHandler(auth));
app.all('/api/auth', toNodeHandler(auth));

// Body parser for all remaining Palateo API endpoints
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// Mount Palateo domain API routes
app.use('/api/user', userRouter);
app.use('/api/catalog', catalogRouter);
app.use('/api/waitlist', waitlistRouter);
app.use('/api/palo', paloRouter);
app.use('/api/search', searchRouter);

// Service info route
app.get('/', (req, res) => {
  res.json({
    service: 'Palateo Cloud Engine',
    version: '1.0.0',
    authProvider: 'Better Auth',
    platform: 'Railway',
    health: '/health',
    authEndpoints: '/api/auth'
  });
});

// Start the server
let serverPromise = null;
export function startServer(port = PORT) {
  if (serverPromise) return serverPromise;
  serverPromise = new Promise(async (resolve, reject) => {
    try {
      await initializeSchema();


      const server = app.listen(port, '0.0.0.0', () => {
        console.log(`\n======================================================`);
        console.log(`Palateo Backend running on port ${port}`);
        console.log(`Better Auth endpoints: http://localhost:${port}/api/auth`);
        console.log(`Railway Healthcheck:   http://localhost:${port}/health`);
        console.log(`Database engine:       ${process.env.DATABASE_URL ? 'PostgreSQL (Railway)' : 'In-memory (Development)'}`);
        console.log(`======================================================\n`);
        resolve(server);
      });
      server.on('error', reject);
    } catch (err) {
      reject(err);
    }
  });
  return serverPromise;
}

// Auto-run if executed directly as entrypoint
if (process.argv[1] && process.argv[1].replace(/\\/g, '/').endsWith('server/index.js')) {
  startServer().catch(() => { console.error('Backend startup failed; verify configuration and database migrations.'); process.exit(1); });
}

// Global process error handlers
process.on('unhandledRejection', (reason) => {
  console.error('[Palateo Backend] Unhandled Rejection:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('[Palateo Backend] Uncaught Exception:', err);
  process.exit(1);
});

export default app;
