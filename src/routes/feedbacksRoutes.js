// routes/feedbacksRoutes.js
import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import {
  getFeedbacksPublic,
  createFeedback,
  getToolFeedbacks,
} from '../controllers/feedbacksController.js';

const feedbacksRoutes = Router();

// Публічний ендпоінт - отримання списку відгуків
feedbacksRoutes.get('/', getFeedbacksPublic);

// ✅ Приватний ендпоінт - створення відгуку
feedbacksRoutes.post('/', authenticate, createFeedback);

feedbacksRoutes.get('/tool/:toolId', getToolFeedbacks);

export default feedbacksRoutes;
