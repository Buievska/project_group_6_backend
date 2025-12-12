import { Router } from 'express';
import { getAllToolsController } from '../controllers/toolsController.js';
const router = Router();

router.get('/', getAllToolsController);
export default router;
