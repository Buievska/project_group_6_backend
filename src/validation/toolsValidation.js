import { Joi, Segments } from 'celebrate';
import { isValidObjectId } from 'mongoose';

const objectIdValidator = (value, helpers) => {
  if (!isValidObjectId(value)) {
    return helpers.message('Invalid ObjectId');
  }
  return value;
};

export const getToolSchema = {
  [Segments.PARAMS]: Joi.object({
    toolId: Joi.custom(objectIdValidator).required(),
  }),
};
