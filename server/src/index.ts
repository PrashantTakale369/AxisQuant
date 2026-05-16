import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import { connectDB } from './config/db';
import authRoutes from './routes/auth';
import hfRoutes from './routes/hf';
import publicationRoutes from './routes/publications';
import teamRoutes from './routes/team';
import benchmarkRoutes from './routes/benchmarks';
import contactRoutes from './routes/contact';
import githubRoutes from './routes/github';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, max: 200, standardHeaders: true }));
app.use('/api/contact', rateLimit({ windowMs: 60 * 1000, max: 5 }));

app.use('/api/auth', authRoutes);
app.use('/api/hf', hfRoutes);
app.use('/api/publications', publicationRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/benchmarks', benchmarkRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/github', githubRoutes);

app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'axisquant-api' }));

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

const start = async () => {
  try {
    await connectDB();
  } catch (err) {
    console.warn('MongoDB unavailable. Run: docker compose -f infra/docker-compose.yml up -d');
    console.warn('DB-dependent routes will fail until MongoDB is connected.');
  }
  app.listen(PORT, () => console.log(`✓ Server running on http://localhost:${PORT}`));
};

start().catch(console.error);

process.on('unhandledRejection', (reason) => {
  console.error('[unhandledRejection]', reason);
});
process.on('uncaughtException', (err) => {
  console.error('[uncaughtException]', err.message);
});
