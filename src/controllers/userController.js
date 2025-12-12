import { Tool } from '../models/tool.js';
import { User } from '../models/user.js';
import createHttpError from 'http-errors';

export const getCurrentUser = async (req, res, next) => {
  try {
    const { _id, name, email, avatarUrl } = req.user;

    res.status(200).json({
      status: 200,
      message: 'Successfully fetched current user',
      data: {
        _id,
        name,
        email,
        avatarUrl,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getUserTools = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { page = 1, perPage = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(perPage);

    const user = await User.findById(userId);
    if (!user) {
      throw createHttpError(404, 'User not found');
    }

    const toolsQuery = Tool.find({ owner: userId });

    const [totalItems, tools] = await Promise.all([
      toolsQuery.clone().countDocuments(),
      toolsQuery
        .skip(skip)
        .limit(Number(perPage))
        .populate('category', 'name')
        .populate('feedbacks')
        .sort({ createdAt: -1 }),
    ]);

    const totalPages = Math.ceil(totalItems / Number(perPage));

    res.status(200).json({
      page: Number(page),
      perPage: Number(perPage),
      totalItems,
      totalPages,
      tools,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      throw createHttpError(404, 'User not found');
    }

    res.status(200).json({
      id: user._id,
      name: user.name,
      avatarUrl: user.avatarUrl,
    });
  } catch (error) {
    next(error);
  }
};
