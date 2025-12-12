import { Router } from 'express';
import { celebrate } from 'celebrate';
import { getUserToolsSchema } from '../validation/userValidation.js';
import { getUserTools } from '../controllers/userController.js';

const router = Router();

router.get("/:userId/tools", celebrate(getUserToolsSchema), getUserTools);

export default router;
