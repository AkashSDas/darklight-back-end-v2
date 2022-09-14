import { Router } from "express";

import { checkAuth, confirmEmail, forgotPassword, getEmailVerificationLink, login, refresh, resetPassword, signup } from "../controllers/base-auth.controller";
import { validateResource } from "../middlewares/validate-resource.middleware";
import { verifyJwt } from "../middlewares/verify-jwt";
import { confirmEmailSchema, forgotPasswordSchema, getEmailVerificationLinkSchema, loginSchema, passwordResetSchema, signupUserSchema } from "../schema/base-auth.schema";
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
    handleAsyncMiddleware(verifyJwt),
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
  );
