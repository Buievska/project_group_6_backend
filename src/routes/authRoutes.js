import { Router } from 'express';
import { celebrate } from 'celebrate';
import {
  loginUserSchema,
  registerUserSchema,
} from '../validation/authValidation.js';
import {
  refreshUser,
  loginUser,
  registerUser,
  logoutUser,
} from '../controllers/authController.js';

import { authenticate } from '../middlewares/authenticate.js';

const router = Router();

router.post('/refresh', refreshUser);

// Login (public)
router.post('/login', celebrate(loginUserSchema), loginUser);
router.post('/register', celebrate(registerUserSchema), registerUser);

//POST /auth/logout
router.post('/logout', authenticate, logoutUser);

export default router;
