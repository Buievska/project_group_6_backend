import { Feedback } from '../models/feedback.js';

export const getFeedbacksPublic = async (req, res, next) => {
  const { page = 1, perPage = 10, rating, search } = req.query;

  const filter = {};

  if (rating) {
    const numericRating = Number(rating);
    if (!isNaN(numericRating) && numericRating >= 1 && numericRating <= 5) {
      filter.rating = numericRating;
    }
  }

  if (search) {
    filter.$text = { $search: search };
  }

  const feedbacksQuery = Feedback.find(filter).populate(
    'user',
    'firstName lastName avatarURL',
  );

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
