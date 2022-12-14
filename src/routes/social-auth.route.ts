import { Router } from "express";
import passport from "passport";

import {
  getLoggedInUser,
  signupWithGoogle,
  signupWithGoogleRedirect,
  addPostOAuthUserInfo,
  socialLogout,
  cancelSocialAuth,
  loginWithGoogle,
  loginWithGoogleRedirect,
  signupWithFacebookRedirect,
  signupWithFacebook,
  loginWithFacebookRedirect,
  loginWithFacebook,
  signupWithTwitter,
  signupWithTwitterRedirect,
  loginWithTwitter,
  loginWithTwitterRedirect,
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
    passport.authenticate("google-signup", { scope: ["profile", "email"] }),
    signupWithGoogle
  )
  .get(
    "/google/redirect",
    passport.authenticate("google-signup", {
      failureMessage: "Cannot signup to Google, Please try again",
      successRedirect: "http://localhost:3000/auth/signup",
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
  )
  .get(
    "/google-login",
    passport.authenticate("google-login", { scope: ["profile", "email"] }),
    loginWithGoogle
  )
  .get(
    "/google-login/redirect",
    passport.authenticate("google-login", {
      failureMessage: "Cannot signup to Google, Please try again",
      successRedirect: "http://localhost:3000/",
      failureRedirect:
        "http://localhost:3000/auth/login?error=incomplete-signup-or-no-user",
    }),
    loginWithGoogleRedirect
  )
  .get(
    "/facebook",
    passport.authenticate("facebook-signup"),
    signupWithFacebook
  )
  .get(
    "/facebook/redirect",
    passport.authenticate("facebook-signup", {
      failureMessage: "Cannot signup to Facebook, Please try again",
      successRedirect: "http://localhost:3000/auth/signup",
      failureRedirect: "http://localhost:3000/auth/signup/error",
    }),
    signupWithFacebookRedirect
  )
  .get(
    "/facebook-login",
    passport.authenticate("facebook-login"),
    loginWithFacebook
  )
  .get(
    "/facebook-login/redirect",
    passport.authenticate("facebook-login", {
      failureMessage: "Cannot signup to Facebook, Please try again",
      successRedirect: "http://localhost:3000/",
      failureRedirect:
        "http://localhost:3000/auth/login?error=incomplete-signup-or-no-user",
    }),
    loginWithFacebookRedirect
  )
  .get("/twitter", passport.authenticate("twitter-signup"), signupWithTwitter)
  .get(
    "/twitter/redirect",
    passport.authenticate("twitter-signup", {
      failureMessage: "Cannot signup to Twitter, Please try again",
      successRedirect: "http://localhost:3000/auth/signup",
      failureRedirect: "http://localhost:3000/auth/signup/error",
    }),
    signupWithTwitterRedirect
  )
  .get(
    "/twitter-login",
    passport.authenticate("twitter-login"),
    loginWithTwitter
  )
  .get(
    "/twitter-login/redirect",
    passport.authenticate("twitter-login", {
      failureMessage: "Cannot signup to Twitter, Please try again",
      successRedirect: "http://localhost:3000/",
      failureRedirect:
        "http://localhost:3000/auth/login?error=incomplete-signup-or-no-user",
    }),
    loginWithTwitterRedirect
  );
