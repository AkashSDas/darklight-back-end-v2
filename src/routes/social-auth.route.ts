import { Router } from "express";
import passport from "passport";

import {
  getLoggedInUser,
  signupWithGoogle,
  signupWithGoogleRedirect,
  addPostOAuthUserInfo,
  socialLogout,
  cancelSocialAuth,
} from "../controllers/social-auth.controller";
import { verifyAuth } from "../middlewares/verify-auth";
import { handleAsyncMiddleware } from "../utils/handle-async";
import { handleMiddlewareError } from "../utils/handle-error";

export const router = Router();

router
  .get(
    "/user",
    handleAsyncMiddleware(verifyAuth),
    handleAsyncMiddleware(getLoggedInUser),
    handleMiddlewareError
  )
  .get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] }),
    signupWithGoogle
  )
  .get(
    "/google/redirect",
    passport.authenticate("google", {
      failureMessage: "Cannot signup to Google, Please try again",
      successRedirect: "http://localhost:3000/auth/signup/success",
      failureRedirect: "http://localhost:3000/auth/signup/error",
    }),
    signupWithGoogleRedirect
  )
  .post(
    "/post-social-auth",
    handleAsyncMiddleware(verifyAuth),
    handleAsyncMiddleware(addPostOAuthUserInfo),
    handleMiddlewareError
  )
  .post(
    "/logout",
    handleAsyncMiddleware(verifyAuth),
    handleAsyncMiddleware(socialLogout),
    handleMiddlewareError
  )
  .post(
    "/cancel-socail-auth",
    handleAsyncMiddleware(verifyAuth),
    handleAsyncMiddleware(cancelSocialAuth),
    handleMiddlewareError
  );
