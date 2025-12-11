import createHttpError from 'http-errors';
import { User } from '../models/user.js';

export const getUserById = async (req, res, next) => {
  const { userId } = req.params;
  const user = await User.findById(userId);

  if (!user) {
    return next(createHttpError(404, 'User not found'));
  }

  res.status(200).json({
    // _id: { $oid: user._id },
    id: user._id,
    name: user.name,
    avatarUrl: user.avatarUrl,
  });
};
