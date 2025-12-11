import { Joi, Segments } from 'celebrate';

export const bookingValidator = {
  [Segments.BODY]: Joi.object({
    instrumentId: Joi.string().required(),
    startTime: Joi.date().iso().required(),
    endTime: Joi.date().iso().required(),
    phone: Joi.string()
      .pattern(/^\+380\d{9}$/)
      .required(),
    city: Joi.string().max(100).required(),
    firstName: Joi.string().max(100).required(),
    lastName: Joi.string().max(100).required(),
    departmentNumber: Joi.string().max(20).required()
  })
};


