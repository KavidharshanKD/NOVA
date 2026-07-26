import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import missionRoutes from './routes/missionRoutes.js';
import planetRoutes from './routes/planetRoutes.js';
import achievementRoutes from './routes/achievementRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import recommendationRoutes from './routes/recommendationRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Database Connection
connectDB();

// Middlewares
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, postman)
    if (!origin) return callback(null, true);
    
    // Check if origin is in the allowed list or is a Vercel preview/deployment URL
    const isAllowed = allowedOrigins.includes(origin) || 
                      origin.endsWith('.vercel.app') || 
                      /https?:\/\/.*-.*\.vercel\.app$/.test(origin);
                      
    if (isAllowed) {
      return callback(null, true);
    }
    
    // Fallback during staging and evaluation, allow but log a warning
    console.warn(`CORS request from unlisted origin: ${origin}. Allow access in evaluation mode.`);
    return callback(null, true);
  },
  credentials: true
}));
app.use(express.json());

// Routes declarations
app.use('/api/auth', authRoutes);
app.use('/api/missions', missionRoutes);
app.use('/api/planets', planetRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/recommendations', recommendationRoutes);

// Base ping route
app.get('/ping', (req, res) => {
  res.json({ message: 'Nova Backend Command Terminal online.', localDBFallback: global.useLocalMockDB });
});

// Centralized error handling
app.use((err, req, res, next) => {
  console.error("Express uncaught error:", err.stack);
  res.status(500).json({ error: 'Internal system fault. Review core registries.' });
});

app.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(`Nova backend server operational on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`===================================================`);
});
