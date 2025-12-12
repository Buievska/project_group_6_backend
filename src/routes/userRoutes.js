import { Router } from 'express';
import { celebrate } from 'celebrate';

import { userIdSchema } from '../validation/userValidation.js';
import { getUserById } from '../controllers/userController.js';

const router = Router();

router.get('/:userId', celebrate(userIdSchema), getUserById);

export default router;
