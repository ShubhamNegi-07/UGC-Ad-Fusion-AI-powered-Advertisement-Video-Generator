import "./configs/instrument.mjs"
import express, { Request, Response } from 'express';
import cors from'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import 'dotenv/config'
import { clerkMiddleware } from '@clerk/express'
import clerkWebhooks from './controllers/clerk.js';
import * as Sentry from "@sentry/node"
import userRouter from "./routes/userRoutes.js";
import projectRouter from "./routes/projectRoutes.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

const PORT = Number.parseInt(process.env.PORT || '5000', 10) || 5000;
const isProd = process.env.NODE_ENV === 'production';

// Local default: no reverse proxy. Render / Vercel / Nginx sit in front in production.
const trustProxyHops = Number.parseInt(process.env.TRUST_PROXY_HOPS || '', 10);
if (Number.isInteger(trustProxyHops) && trustProxyHops > 0) {
    app.set('trust proxy', trustProxyHops);
} else {
    app.set('trust proxy', isProd ? 1 : false);
}

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
    ...(isProd && envOrigins.length > 0 ? [] : defaultDevOrigins),
]);

if (isProd && envOrigins.length === 0) {
    console.error('[CORS] Set CORS_ORIGINS to your Vercel origin, e.g. https://your-app.vercel.app');
}

function originAllowed(origin: string) {
    if (allowedOrigins.has(origin)) return true;
    for (const pattern of allowedOrigins) {
        if (!pattern.includes('*')) continue;
        const escaped = pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace('\\*', '[^.]+');
        if (new RegExp(`^${escaped}$`).test(origin)) return true;
    }
    return false;
}

//Middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
}))

const corsMiddleware = cors({
    origin: (origin, callback) => {
        if (!origin || originAllowed(origin)) {
            return callback(null, true);
        }
        return callback(new Error('Origin not allowed by CORS'));
    },
    methods: ['GET', 'HEAD', 'POST', 'DELETE', 'OPTIONS'],
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

// Public health check — keep before Clerk so monitors (UptimeRobot HEAD/GET) get 200.
app.route('/')
    .get((_req: Request, res: Response) => {
        res.status(200).json({ status: 'ok', message: 'Server is running' });
    })
    .head((_req: Request, res: Response) => {
        res.status(200).end();
    });

app.use(clerkMiddleware())

app.use('/api/user', globalApiLimiter, userRouter)
app.use('/api/project', globalApiLimiter, projectRouter)

// The error handler must be registered before any other error middleware and after all controllers
Sentry.setupExpressErrorHandler(app);

app.use(errorHandler);

const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});

server.requestTimeout = 310_000;
server.headersTimeout = 60_000;