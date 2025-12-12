import createHttpError from 'http-errors';
import { Session } from '../models/session.js';
import { User } from '../models/user.js';

export const authenticate = async (req, res, next) => {
  try {
    // 1. Спочатку шукаємо токен у куках (для браузера)
    let token = req.cookies.accessToken;

    // 2. Якщо в куках немає, шукаємо в заголовку Authorization (для Postman/Mobile)
    if (!token && req.headers.authorization) {
      const bearer = req.headers.authorization.split(' ');
      // Формат заголовка: "Bearer <token>"
      if (bearer.length === 2 && bearer[0] === 'Bearer') {
        token = bearer[1];
      }
    }

    if (!token) {
      throw createHttpError(401, 'Missing access token');
    }

    const session = await Session.findOne({ accessToken: token });

    if (!session) {
      throw createHttpError(401, 'Session not found');
    }

    const isAccessTokenExpired =
      new Date() > new Date(session.accessTokenValidUntil);
    if (isAccessTokenExpired) {
      throw createHttpError(401, 'Access token expired');
    }

    const user = await User.findById(session.userId);

    if (!user) {
      throw createHttpError(401);
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};
