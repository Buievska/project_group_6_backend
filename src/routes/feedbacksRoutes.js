import { Router } from 'express';

import { authenticate } from '../middlewares/authenticate.js';

import {
  getFeedbacksPublic,
  createFeedback,
  deleteFeedback,
  updateFeedback,
} from '../controllers/feedbacksController.js';

const feedbacksRoutes = Router();

feedbacksRoutes.get('/public', getFeedbacksPublic);

feedbacksRoutes.post('/', authenticate, createFeedback);

feedbacksRoutes.patch('/:feedbackId', authenticate, updateFeedback);

feedbacksRoutes.delete('/:feedbackId', authenticate, deleteFeedback);

export default feedbacksRoutes;
