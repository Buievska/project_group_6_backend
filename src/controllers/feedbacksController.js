// controllers/feedbacksController.js
import createHttpError from 'http-errors';
import { Feedback } from '../models/feedback.js';
import { Tool } from '../models/tool.js';
import { User } from '../models/user.js';
import { createFeedbackSchema } from '../validation/feedbackValidation.js';

// ✅ Існуючий публічний ендпоінт
export const getFeedbacksPublic = async (req, res, next) => {
  const { page = 1, perPage = 10, rate, search } = req.query;

  const filter = {};

  if (rate) {
    const numericRate = Number(rate);
    if (!isNaN(numericRate) && numericRate >= 1 && numericRate <= 5) {
      filter.rate = numericRate;
    }
  }

  if (search) {
    filter.$text = { $search: search };
  }

  const feedbacksQuery = Feedback.find(filter)
    .populate('owner', 'name avatarUrl')
    .populate('toolOwner', 'name averageRating feedbackCount');

  const skip = (page - 1) * perPage;

  try {
    const [totalFeedbacks, feedbacks] = await Promise.all([
      feedbacksQuery.clone().countDocuments(),
      feedbacksQuery.sort({ createdAt: -1 }).skip(skip).limit(perPage),
    ]);

    const totalPages = Math.ceil(totalFeedbacks / perPage);

    res.status(200).json({
      status: 'success',
      code: 200,
      page: Number(page),
      perPage: Number(perPage),
      totalFeedbacks,
      totalPages,
      data: {
        feedbacks,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ✅ НОВИЙ приватний ендпоінт для створення відгуку
export const createFeedback = async (req, res, next) => {
  try {
    // 1. Валідація вхідних даних
    const { error, value } = createFeedbackSchema.validate(req.body);
    if (error) {
      throw createHttpError(400, error.details[0].message);
    }

    const { rate, description, toolId } = value;
    const userId = req.user._id;

    // 2. Перевіряємо чи існує інструмент
    const tool = await Tool.findById(toolId);
    if (!tool) {
      throw createHttpError(404, 'Інструмент не знайдено');
    }

    // 3. Перевіряємо що користувач не залишає відгук на власний інструмент
    if (tool.owner.toString() === userId.toString()) {
      throw createHttpError(403, 'Ви не можете залишити відгук на власний інструмент');
    }

    // 4. Перевіряємо чи користувач вже залишав відгук на цей інструмент
    // (додатковий захист, хоча є унікальний індекс)
    const existingFeedback = await Feedback.findOne({
      owner: userId,
      tool: toolId,
    });
    if (existingFeedback) {
      throw createHttpError(409, 'Ви вже залишили відгук на цей інструмент');
    }

    // 5. Створюємо відгук
    const feedback = await Feedback.create({
      rate,
      description,
      owner: userId,
      tool: toolId,
      toolOwner: tool.owner,
    });

    // 6. Додаємо відгук до масиву feedbacks інструменту
    await Tool.findByIdAndUpdate(toolId, {
      $push: { feedbacks: feedback._id },
    });

    // 7. Перераховуємо рейтинг інструменту
    await recalculateToolRating(toolId);

    // 8. Перераховуємо рейтинг та кількість відгуків для власника інструменту
    await recalculateUserRating(tool.owner);

    // 9. Повертаємо створений відгук з populated полями
    const populatedFeedback = await Feedback.findById(feedback._id)
      .populate('owner', 'name avatarUrl')
      .populate('tool', 'name images')
      .populate('toolOwner', 'name averageRating feedbackCount');

    res.status(201).json({
      status: 'success',
      code: 201,
      message: 'Відгук успішно створено',
      data: {
        feedback: populatedFeedback,
      },
    });
  } catch (error) {
    // Обробка помилки унікального індексу MongoDB
    if (error.code === 11000) {
      return next(createHttpError(409, 'Ви вже залишили відгук на цей інструмент'));
    }
    next(error);
  }
};

// ✅ Функція для перерахунку рейтингу інструменту
const recalculateToolRating = async (toolId) => {
  const result = await Feedback.aggregate([
    { $match: { tool: toolId } },
    {
      $group: {
        _id: '$tool',
        averageRating: { $avg: '$rate' },
      },
    },
  ]);

  const newRating = result.length > 0 ? Math.round(result[0].averageRating * 10) / 10 : 0;

  await Tool.findByIdAndUpdate(toolId, { rating: newRating });
};

// ✅ Функція для перерахунку рейтингу користувача (власника інструментів)
const recalculateUserRating = async (userId) => {
  // Отримуємо всі відгуки на інструменти цього користувача
  const result = await Feedback.aggregate([
    { $match: { toolOwner: userId } },
    {
      $group: {
        _id: '$toolOwner',
        averageRating: { $avg: '$rate' },
        feedbackCount: { $sum: 1 },
      },
    },
  ]);

  if (result.length > 0) {
    const { averageRating, feedbackCount } = result[0];
    // Округлюємо до 1 знаку після коми
    const roundedRating = Math.round(averageRating * 10) / 10;

    await User.findByIdAndUpdate(userId, {
      averageRating: roundedRating,
      feedbackCount,
    });
  } else {
    // Якщо немає відгуків, скидаємо значення
    await User.findByIdAndUpdate(userId, {
      averageRating: 0,
      feedbackCount: 0,
    });
  }
};
