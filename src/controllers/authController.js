import createHttpError from 'http-errors';
import bcrypt from 'bcryptjs';
import { User } from '../models/user.js';
import { Session } from '../models/session.js';
import {
  createSession,
  setSessionCookies,
  refreshSession,
} from '../services/auth.js';

// Login

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(401, 'Invalid credentials');
  }
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw createHttpError(401, 'Invalid credentials');
  }

  await Session.deleteOne({ userId: user._id });
  const newSession = await createSession(user._id);
  setSessionCookies(res, newSession);

  res.status(200).json(user);
};

// Register
export const registerUser = async (req, res) => {
  const { email, password, name } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createHttpError(400, 'Email in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  const newSession = await createSession(newUser._id);
  setSessionCookies(res, newSession);
  res.status(201).json(newUser);
};

export const refreshUser = async (req, res) => {
  const { sessionId, refreshToken } = req.cookies;

  if (!sessionId || !refreshToken) {
    throw createHttpError(401, 'Session missing');
  }

  try {
    const newSession = await refreshSession({ sessionId, refreshToken });

    if (!newSession) {
      throw createHttpError(401, 'Session expired or invalid');
    }

    setSessionCookies(res, newSession);

    res.status(200).json({
      status: 200,
      message: 'Successfully refreshed session!',
      data: {
        accessToken: newSession.accessToken,
      },
    });
  } catch (error) {
    res.clearCookie('sessionId');
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    throw error;
  }
};

export const logoutUser = async (req, res) => {
  const { sessionId, refreshToken } = req.cookies;

  if (sessionId) {
    await Session.deleteOne({ _id: sessionId });
  } else if (refreshToken) {
    await Session.deleteOne({ refreshToken: refreshToken });
  }

  res.clearCookie('sessionId');
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');

  res.status(204).send();
};
