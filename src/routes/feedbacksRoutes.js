// routes/feedbacksRoutes.js
import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import {
  getFeedbacksPublic,
  createFeedback,
} from '../controllers/feedbacksController.js';

const feedbacksRoutes = Router();

// Публічний ендпоінт - отримання списку відгуків
feedbacksRoutes.get('/', getFeedbacksPublic);

// ✅ Приватний ендпоінт - створення відгуку
feedbacksRoutes.post('/', authenticate, createFeedback);

export default feedbacksRoutes;
