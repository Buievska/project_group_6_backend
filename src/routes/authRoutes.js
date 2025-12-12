import { Router } from 'express';
import { celebrate } from 'celebrate';
import {
  loginUserSchema,
  registerUserSchema,
} from '../validation/authValidation.js';
import { loginUser, registerUser } from '../controllers/authController.js';

const router = Router();

// Login (public)
router.post('/login', celebrate(loginUserSchema), loginUser);
router.post('/register', celebrate(registerUserSchema), registerUser);

export default router;
