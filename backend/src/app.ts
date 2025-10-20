import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import 'express-async-errors';
import { config } from './config/env';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import logger from './utils/logger';
import authRoutes from './routes/authRoutes';

const app: Application = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: config.cors.origin,
    credentials: true,
  })
);

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Hospital Management System API is running',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
  });
});

// API routes
app.use(`/api/${config.apiVersion}/auth`, authRoutes);
// Additional routes will be added here
// app.use(`/api/${config.apiVersion}/patients`, patientRoutes);
// etc.

// 404 handler
app.use(notFoundHandler);

// Error handler
app.use(errorHandler);

export default app;
