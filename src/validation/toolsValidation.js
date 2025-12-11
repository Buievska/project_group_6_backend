import Joi from 'joi';
import { Segments } from 'celebrate';

export const createToolSchema = {
  [Segments.BODY]: Joi.object({
    category: Joi.string().required(), // ObjectId як рядок
    name: Joi.string().trim().min(1).max(100).required(),
    description: Joi.string().trim().max(1000).allow(''),
    pricePerDay: Joi.number().positive().required(),
    images: Joi.string().uri().required(),
    rating: Joi.number().min(0).max(5).optional(),
    specifications: Joi.object().optional(),
    rentalTerms: Joi.string().trim().max(500).optional(),
    bookedDates: Joi.array().items(Joi.string().isoDate()).optional(),
  }),
};
