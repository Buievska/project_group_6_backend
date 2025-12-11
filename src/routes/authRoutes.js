import { Router } from 'express';
import { celebrate } from 'celebrate';
import { loginUserSchema } from '../validation/authValidation.js';
import { loginUser } from '../controllers/authController.js';


const router = Router();

// Login (public)
router.post("/login", celebrate(loginUserSchema), loginUser);


export default router;
