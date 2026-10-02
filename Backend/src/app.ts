import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { errorHandler } from './middleware/errorHandler';
import adminRoutes from './routes/admins';
import guesthouseRoutes from './routes/guesthouses';

const app = express();
// Apply security and performance middlewares
app.use(helmet());
app.use(cors({ origin: (process.env.CORS_ORIGINS ?? '').split(',').filter(Boolean) }));
app.use(express.json({ limit: '100kb' }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 300 }));
// Health check endpoint to verify that the server is running
app.get('/api/health', (_req, res) => {
  res.json({ success: true, data: { status: 'ok' } });
});// Mount the admin and guesthouse routes

app.use('/api/admins', adminRoutes);
app.use('/api/guesthouses', guesthouseRoutes);

app.use(errorHandler); // must stay last
export default app;
