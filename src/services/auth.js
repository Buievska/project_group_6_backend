import crypto from "crypto";
import { Session } from "../models/session.js";
import { FIFTEEN_MINUTES, ONE_DAY } from "../constants/time.js";

export const createSession = async (userId) => {

  const accessToken = crypto.randomBytes(16).toString("base64");
  const refreshToken = crypto.randomBytes(16).toString("hex");

  return Session.create({
      userId,
      accessToken,
      refreshToken,
      accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES), // 15 minutes
      refreshTokenValidUntil: new Date(Date.now() + ONE_DAY), // 1 day
  });
};

export const setSessionCookies = (res, session) => {

      res.cookie("accessToken", session.accessToken, {
          httpOnly: true, // доступ лише через HTTP
          secure: true, // лише по HTTPS
          sameSite:"none", // кросс-доменные запити
          maxAge: FIFTEEN_MINUTES, // 15 хвилин
      });

      res.cookie("refreshToken", session.refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite:"none",
          maxAge: ONE_DAY, // 1 день
      });

      res.cookie("sessionId", session._id, {
          httpOnly: true,
          secure: true,
          sameSite:"none",
          maxAge: ONE_DAY, // 1 день
      });
};
