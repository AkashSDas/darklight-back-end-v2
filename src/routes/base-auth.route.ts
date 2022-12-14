import { Router } from "express";

import {
  checkAuth,
  confirmEmail,
  emailAvailable,
  forgotPassword,
  getEmailVerificationLink,
  login,
  logout,
  refresh,
  resetPassword,
  signup,
  usernameAvailable,
} from "../controllers/base-auth.controller";
import { validateResource } from "../middlewares/validate-resource.middleware";
import { verifyAuth } from "../middlewares/verify-auth";
import {
  confirmEmailSchema,
  emailAvailableSchema,
  forgotPasswordSchema,
  getEmailVerificationLinkSchema,
  loginSchema,
  passwordResetSchema,
  signupUserSchema,
  usernameAvailableSchema,
} from "../schema/base-auth.schema";
import { handleAsyncMiddleware } from "../utils/handle-async";
import { handleMiddlewareError } from "../utils/handle-error";

export const router = Router();

router
  .post(
    "/signup",
    validateResource(signupUserSchema),
    handleAsyncMiddleware(signup),
    handleMiddlewareError
  )
  .post(
    "/verify-email-token",
    validateResource(getEmailVerificationLinkSchema),
    handleAsyncMiddleware(getEmailVerificationLink),
    handleMiddlewareError
  )
  .get(
    "/confirm-email/:token",
    validateResource(confirmEmailSchema),
    handleAsyncMiddleware(confirmEmail),
    handleMiddlewareError
  )
  .post(
    "/login",
    validateResource(loginSchema),
    handleAsyncMiddleware(login),
    handleMiddlewareError
  )
  .get(
    "/check-auth",
    handleAsyncMiddleware(verifyAuth),
    handleAsyncMiddleware(checkAuth),
    handleMiddlewareError
  )
  .get("/refresh", handleAsyncMiddleware(refresh), handleMiddlewareError)
  .post(
    "/forgot-password",
    validateResource(forgotPasswordSchema),
    handleAsyncMiddleware(forgotPassword),
    handleMiddlewareError
  )
  .post(
    "/password-reset/:token",
    validateResource(passwordResetSchema),
    handleAsyncMiddleware(resetPassword),
    handleMiddlewareError
  )
  .post("/logout", handleAsyncMiddleware(logout), handleMiddlewareError)
  .get(
    "/available/username/:username",
    validateResource(usernameAvailableSchema),
    handleAsyncMiddleware(usernameAvailable),
    handleMiddlewareError
  )
  .get(
    "/available/email/:email",
    validateResource(emailAvailableSchema),
    handleAsyncMiddleware(emailAvailable),
    handleMiddlewareError
  );
