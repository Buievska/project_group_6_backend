// validation/feedbackValidation.js
import Joi from 'joi';

export const createFeedbackSchema = Joi.object({
  rate: Joi.number()
    .integer()
    .min(1)
    .max(5)
    .required()
    .messages({
      'number.base': 'Рейтинг має бути числом',
      'number.min': 'Рейтинг має бути від 1 до 5',
      'number.max': 'Рейтинг має бути від 1 до 5',
      'any.required': 'Рейтинг є обов\'язковим полем',
    }),

  description: Joi.string()
    .max(500)
    .trim()
    .allow('')
    .default('')
    .messages({
      'string.max': 'Опис не може перевищувати 500 символів',
    }),

  toolId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Невірний формат ID інструменту',
      'any.required': 'ID інструменту є обов\'язковим',
    }),
});
