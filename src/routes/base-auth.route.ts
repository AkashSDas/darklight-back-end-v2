import { Router } from "express";

import { confirmEmail, getEmailVerificationLink, signup } from "../controllers/base-auth.controller";
import { validateResource } from "../middlewares/validate-resource.middleware";
import { confirmEmailSchema, getEmailVerificationLinkSchema, signupUserSchema } from "../schema/base-auth.schema";
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
  );
