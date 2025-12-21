import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import { celebrate } from 'celebrate';
import { bookingValidator } from '../validation/bookingValidation.js';
import {
  bookingController,
  getUserBookingsController,
  deleteBookingController,
} from '../controllers/bookingsController.js';

const router = Router();

router.use(authenticate);

router.post('/', celebrate(bookingValidator), bookingController);

router.get('/my', getUserBookingsController);

router.delete('/:id', deleteBookingController);

export default router;
