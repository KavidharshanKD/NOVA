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
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
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
