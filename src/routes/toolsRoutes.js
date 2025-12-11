import { Router } from 'express';
import { celebrate } from 'celebrate';

import { getToolById } from '../controllers/toolsController.js';
import { getToolSchema } from '../validation/toolsValidation.js';

const router = Router();

router.get('/:toolId', celebrate(getToolSchema), getToolById);

export default router;
