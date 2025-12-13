import 'dotenv/config';
import express from 'express';
import { errors } from 'celebrate';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import fs from 'node:fs';
import path from 'node:path';

import { connectMongoDB } from './db/connectMongoDB.js';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import toolsRoutes from './routes/toolsRoutes.js';
import bookingsRoutes from './routes/bookingsRoutes.js';
import categoriesRoutes from './routes/categoriesRoutes.js';
import feedbacksRoutes from './routes/feedbacksRoutes.js';

import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { logger } from './middlewares/logger.js';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

const swaggerDocument = JSON.parse(
  fs.readFileSync(path.resolve('swagger.json'), 'utf-8'),
);

app.use(logger);
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:3002',
        'http://localhost:3003',
        process.env.CLIENT_ORIGIN,
      ];

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tools', toolsRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/feedbacks', feedbacksRoutes);

app.use(notFoundHandler);
app.use(errors());
app.use(errorHandler);

const startServer = async () => {
  try {
    await connectMongoDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(
        `Swagger docs available at http://localhost:${PORT}/api-docs`,
      );
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
