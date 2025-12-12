
import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import User from '../models/user.js';
import Session from '../models/session.js';

const FIFTEEN_MINUTES = 15 * 60 * 1000;
const ONE_DAY = 24 * 60 * 60 * 1000;

const generateRandomToken = () => crypto.randomBytes(32).toString('base64');

export const createSession = async (userId) => {
  const accessToken = generateRandomToken();
  const refreshToken = generateRandomToken();

  const now = new Date();
  const accessTokenValidUntil = new Date(now.getTime() + FIFTEEN_MINUTES);
  const refreshTokenValidUntil = new Date(now.getTime() + ONE_DAY);

  const session = await Session.create({
    userId,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });

  return session;
};

export const setSessionCookies = (res, session) => {
  const { accessToken, refreshToken, _id: sessionId } = session;

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  };

  // accessToken (15 хв)
  res.cookie('accessToken', accessToken, {
    ...cookieOptions,
    maxAge: FIFTEEN_MINUTES,
  });

  // refreshToken (1 день)
  res.cookie('refreshToken', refreshToken, {
    ...cookieOptions,
    maxAge: ONE_DAY,
  });

  // sessionId (1 день)
  res.cookie('sessionId', sessionId, {
    ...cookieOptions,
    maxAge: ONE_DAY,
  });
};

export const clearSessionCookies = (res) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.clearCookie('sessionId');
};

export const registerUser = async (payload) => {
  const user = await User.findOne({ email: payload.email });
  if (user) throw createHttpError(409, 'Email in use');

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  return await User.create({
    ...payload,
    password: encryptedPassword,
  });
};

export const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw createHttpError(401, 'User not found');

  const isEqual = await bcrypt.compare(password, user.password);
  if (!isEqual) throw createHttpError(401, 'Unauthorized');

  const session = await createSession(user._id);

  return session;
};

export const logoutUser = async (sessionId) => {
  await Session.deleteOne({ _id: sessionId });
};

export const refreshSession = async (sessionId, refreshToken) => {
  const session = await Session.findOne({ _id: sessionId, refreshToken });

  if (!session) throw createHttpError(401, 'Session not found');

  const isSessionTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);
  if (isSessionTokenExpired)
    throw createHttpError(401, 'Session token expired');

  await Session.deleteOne({ _id: sessionId });

  const newSession = await createSession(session.userId);
  return newSession;

};
