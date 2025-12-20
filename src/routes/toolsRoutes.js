import { Router } from 'express';
import { getAllToolsController } from '../controllers/toolsController.js';
import { celebrate } from 'celebrate';

import { getToolById } from '../controllers/toolsController.js';
import { createTool } from '../controllers/toolsController.js';
import { updateTool } from '../controllers/toolsController.js';
import { deleteTool } from '../controllers/toolsController.js';
import { authenticate } from '../middlewares/authenticate.js';
import { uploadImage } from '../middlewares/multer.js';

import {
  getToolSchema,
  createToolSchema,
  updateToolSchema,
} from '../validation/toolsValidation.js';

const router = Router();

const parseToolData = (req, res, next) => {
  try {
    if (
      req.body.specifications &&
      typeof req.body.specifications === 'string'
    ) {
      req.body.specifications = JSON.parse(req.body.specifications);
    }
    next();
  } catch (error) {
    console.error('JSON Parse Error:', error);

    res
      .status(400)
      .json({ message: 'Невірний формат характеристик (очікується JSON)' });
  }
};

router.get('/', getAllToolsController);

// Отримати інструмент по ID (публічний)
router.get('/:toolId', celebrate(getToolSchema), getToolById);

// Створити інструмент (авторизований)
router.post(
  '/',
  authenticate,
  uploadImage,
  parseToolData,
  celebrate(createToolSchema),
  createTool,
);

router.patch(
  '/:toolId',
  authenticate,
  uploadImage,
  parseToolData,
  celebrate(updateToolSchema),
  updateTool,
);

// ПРИВАТНЕ ВИДАЛЕННЯ ІНСТРУМЕНТУ
router.delete('/:toolId', authenticate, celebrate(getToolSchema), deleteTool);

export default router;
