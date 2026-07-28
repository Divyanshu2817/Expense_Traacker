import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import budgetRoutes from './routes/budgetRoutes.js';
import goalRoutes from './routes/goalRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS — allow localhost in dev, any *.onrender.com domain, and the explicit FRONTEND_URL
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173',
  'http://localhost:5174',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, Postman, mobile apps)
    if (!origin) return callback(null, true);
    // Always allow any Render.com hosted domain (covers dynamic preview URLs)
    if (origin.endsWith('.onrender.com')) return callback(null, true);
    // Allow explicit whitelist
    if (allowedOrigins.includes(origin)) return callback(null, true);
    console.warn(`[CORS] Blocked origin: ${origin}`);
    return callback(new Error(`CORS: Origin ${origin} not allowed`));
  },
  credentials: true,
}));

app.use(express.json());

// Initialize Database connection
connectDB();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/analytics', analyticsRoutes);

// Root — friendly API welcome page (so visiting the bare URL doesn't show "Not Found")
app.get('/', (req, res) => {
  res.json({
    app: '💎 AuraFinance API',
    status: 'online',
    version: '1.0.0',
    message: 'Backend is running. Use /api/* endpoints.',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth/login | /api/auth/register',
      transactions: '/api/transactions',
      budgets: '/api/budgets',
      goals: '/api/goals',
      analytics: '/api/analytics/summary | /api/analytics/health | /api/analytics/subscriptions'
    },
    timestamp: new Date().toISOString()
  });
});

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'AuraFinance – Expense Tracker & Financial Intelligence API',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🚀 AuraFinance Backend running at http://localhost:${PORT}`);
});
