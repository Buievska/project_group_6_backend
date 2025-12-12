import { Feedback } from '../models/feedback.js';

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

    .populate('toolOwner', 'name averageRating');

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
