import "./configs/instrument.mjs"
import express, { Request, Response, NextFunction } from 'express';
import cors from'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import 'dotenv/config'
import { clerkMiddleware } from '@clerk/express'
import clerkWebhooks from './controllers/clerk.js';
import * as Sentry from "@sentry/node"
import userRouter from "./routes/userRoutes.js";
import projectRouter from "./routes/projectRoutes.js";

const app = express();

const PORT = process.env.PORT || 5000;

// Local development default: false (no reverse proxy).
// In production behind a reverse proxy (Render, Railway, Nginx), set TRUST_PROXY_HOPS=1 in .env.
const trustProxyHops = Number.parseInt(process.env.TRUST_PROXY_HOPS || '', 10);
app.set('trust proxy', Number.isInteger(trustProxyHops) && trustProxyHops > 0 ? trustProxyHops : false);

const globalApiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 120,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { message: 'Too many requests, please try again later.' },
});

const defaultDevOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:4173',
    'http://127.0.0.1:4173',
];
const envOrigins = (process.env.CORS_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
const allowedOrigins = new Set([
    ...envOrigins,
    ...(process.env.NODE_ENV === 'production' && envOrigins.length > 0 ? [] : defaultDevOrigins),
]);

//Middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
}))

const corsMiddleware = cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.has(origin)) {
            return callback(null, true);
        }
        return callback(new Error('Origin not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'svix-id', 'svix-timestamp', 'svix-signature'],
})

app.use((req, res, next) => {
    if (req.path === '/api/clerk') return next();
    return corsMiddleware(req, res, next);
})

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
})

// Raw body must be kept for Svix signature verification. Do this before express.json().
app.post('/api/clerk', express.raw({ type: () => true, limit: '64kb' }), clerkWebhooks)

app.use(express.json({ limit: '100kb' }))
app.use(clerkMiddleware())

app.get('/', (req: Request, res: Response) => {
    res.send('Server is Live!');
});

app.use('/api/user', globalApiLimiter, userRouter)
app.use('/api/project', globalApiLimiter, projectRouter)

// The error handler must be registered before any other error middleware and after all controllers
Sentry.setupExpressErrorHandler(app);

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error('[Unhandled Server Error]', err);
    if (res.headersSent) return;
    if (err?.message === 'Origin not allowed by CORS') {
        return res.status(403).json({ message: 'Forbidden origin' });
    }
    res.status(500).json({ message: 'Internal server error' });
});

const server = app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

server.requestTimeout = 310_000;
server.headersTimeout = 60_000;