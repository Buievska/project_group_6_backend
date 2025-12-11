import { Router } from 'express';
import { createTool } from '../controllers/toolController.js';
import { authenticate } from '../middlewares/authenticate.js';
import { celebrate } from 'celebrate';
import { createToolSchema } from '../validation/toolsValidation.js';

const router = Router();

// Створити новий інструмент — тільки для авторизованих
router.post('/', authenticate, celebrate(createToolSchema), createTool);

export default router;
