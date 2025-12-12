import { Router } from 'express';
import { logoutUser } from '../controllers/authController.js';
import { authenticate } from '../middlewares/authenticate.js';

const router = Router();

//POST /auth/logout
router.post('/auth/logout', authenticate, logoutUser);

export default router;
