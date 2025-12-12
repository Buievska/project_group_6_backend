import { Router } from 'express';
import { getAllToolsController } from '../controllers/toolsController.js';
import { celebrate } from 'celebrate';

import { getToolById } from '../controllers/toolsController.js';
import { createTool } from '../controllers/toolsController.js';
import { authenticate } from '../middlewares/authenticate.js';
import { uploadImage } from '../middlewares/multer.js';

import {
  getToolSchema,
  createToolSchema,
} from '../validation/toolsValidation.js';

const router = Router();

router.get('/', getAllToolsController);

// Отримати інструмент по ID (публічний)
router.get('/:toolId', celebrate(getToolSchema), getToolById);

// Створити інструмент (авторизований)
router.post(
  '/',
  authenticate,
  uploadImage,
  celebrate(createToolSchema),
  createTool,
);

export default router;
