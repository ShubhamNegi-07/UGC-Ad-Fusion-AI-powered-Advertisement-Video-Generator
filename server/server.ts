import "./configs/instrument.mjs"
import express, { Request, Response } from 'express';
import cors from'cors'
import 'dotenv/config'
import { clerkMiddleware } from '@clerk/express'
import clerkWebhooks from './controllers/clerk.js';
import * as Sentry from "@sentry/node"
import userRouter from "./routes/userRoutes.js";
import projectRouter from "./routes/projectRoutes.js";

const app = express();

const PORT = process.env.PORT || 5000;

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
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.has(origin)) {
            return callback(null, true);
        }
        return callback(new Error('Origin not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}))

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
})

app.post('/api/clerk', express.raw({ type: 'application/json'}), clerkWebhooks)

app.use(express.json())
app.use(clerkMiddleware())

app.get('/', (req: Request, res: Response) => {
    res.send('Server is Live!');
});

app.use('/api/user', userRouter)
app.use('/api/project', projectRouter)

// The error handler must be registered before any other error middleware and after all controllers
Sentry.setupExpressErrorHandler(app);

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});