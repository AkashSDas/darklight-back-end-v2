import { Router } from "express";
import { handleAsyncMiddleware } from "../utils/handle-async";
import {
  checkUsernameAvaiable,
  checkEmailAvaiable,
  signupForInstructor,
} from "../controllers/user.controller";
import { handleMiddlewareError } from "../utils/handle-error";
import { validateResource } from "../middlewares/validate-resource.middleware";
import {
  checkEmailAvaiableSchema,
  checkUsernameAvaiableSchema,
  signupForInstructorSchema,
} from "../schema/user.schema";
import { verifyAuth } from "../middlewares/verify-auth";

export const router = Router();

router
  .get(
    "/check-username-available/:username",
    validateResource(checkUsernameAvaiableSchema),
    handleAsyncMiddleware(checkUsernameAvaiable),
    handleMiddlewareError
  )
  .get(
    "/check-email-available/:email",
    validateResource(checkEmailAvaiableSchema),
    handleAsyncMiddleware(checkEmailAvaiable),
    handleMiddlewareError
  )
  .get(
    "/instructor-signup/:userId",
    validateResource(signupForInstructorSchema),
    handleAsyncMiddleware(verifyAuth),
    handleAsyncMiddleware(signupForInstructor),
    handleMiddlewareError
  );
