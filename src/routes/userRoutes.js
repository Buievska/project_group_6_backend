import { Router } from 'express';
import { celebrate } from 'celebrate';
import {
  userIdSchema,
  getUserToolsSchema,
} from '../validation/userValidation.js';
import {
  getUserById,
  getUserTools,
  getCurrentUser,
} from '../controllers/userController.js';
import { authenticate } from '../middlewares/authenticate.js';

const router = Router();

router.get('/current', authenticate, getCurrentUser);

router.get('/:userId', celebrate(userIdSchema), getUserById);

router.get('/:userId/tools', celebrate(getUserToolsSchema), getUserTools);

export default router;
