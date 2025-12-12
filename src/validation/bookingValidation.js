import { Joi, Segments } from 'celebrate';

export const bookingValidator = {
  [Segments.BODY]: Joi.object({
    toolId: Joi.alternatives()
      .try(Joi.string(), Joi.number())
      .required(),
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),
    phone: Joi.string()
      .pattern(/^\+380\d{9}$/)
      .required(),
    startDate: Joi.string()
      .pattern(/^\d{4}-\d{2}-\d{2}$/)
      .required(),
    endDate: Joi.string()
      .pattern(/^\d{4}-\d{2}-\d{2}$/)
      .required(),
    deliveryCity: Joi.string().min(2).max(100).required(),
    deliveryBranch: Joi.string().min(1).max(200).required()
  })
};


