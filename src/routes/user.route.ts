import { Router } from "express";
import { handleAsyncMiddleware } from "../utils/handle-async";
import {
  checkUsernameAvaiable,
  checkEmailAvaiable,
} from "../controllers/user.controller";
import { handleMiddlewareError } from "../utils/handle-error";
import { validateResource } from "../middlewares/validate-resource.middleware";
import {
  checkEmailAvaiableSchema,
  checkUsernameAvaiableSchema,
} from "../schema/user.schema";

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
  );
