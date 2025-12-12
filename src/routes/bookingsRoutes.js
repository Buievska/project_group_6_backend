import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import { celebrate } from 'celebrate';
import { bookingValidator } from '../validation/bookingValidation.js';
import { bookingController } from '../controllers/bookingsController.js';

const router = Router();

router.use(authenticate);

router.post('/', celebrate(bookingValidator), bookingController);

export default router;
