import Joi from 'joi';
import { Segments } from 'celebrate';

export const createToolSchema = {
  [Segments.BODY]: Joi.object({
    name: Joi.string().trim().min(3).max(96).required(),
    pricePerDay: Joi.number().min(0).required(),
    categoryId: Joi.string().required(), // ID -> string (ObjectId)
    description: Joi.string().trim().min(20).max(2000).required(),
    rentalTerms: Joi.string().trim().min(20).max(1000).required(),
    specifications: Joi.object().max(1000).optional(),
    images: Joi.string().uri().required(),
    rating: Joi.number().min(0).max(5).optional(),
    bookedDates: Joi.array().items(Joi.string().isoDate()).optional(),
  }),
};
