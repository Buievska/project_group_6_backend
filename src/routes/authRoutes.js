import { Router } from 'express';
import { logoutUser } from '../controllers/authController.js';

const router = Router();

//POST /auth/logout
router.post('/auth/logout', logoutUser);

export default router;
