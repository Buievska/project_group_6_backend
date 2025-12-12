import createHttpError from 'http-errors';
import { User } from '../models/user.js';

export const getUserById = async (req, res, next) => {
  const { userId } = req.params;
  const user = await User.findById(userId);

  if (!user) {
    return next(createHttpError(404, 'User not found'));
  }

  res.status(200).json({
    id: user._id,
    name: user.name,
    avatarUrl: user.avatarUrl,
  });
};

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
