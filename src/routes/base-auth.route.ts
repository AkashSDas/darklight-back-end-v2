import { Router } from "express";

import { signup } from "../controllers/base-auth.controller";
import { validateResource } from "../middlewares/validate-resource.middleware";
import { signupUserSchema } from "../schema/base-auth.schema";
import { handleAsyncMiddleware } from "../utils/handle-async";
import { handleMiddlewareError } from "../utils/handle-error";

export const router = Router();

router.post(
  "/signup",
  validateResource(signupUserSchema),
  handleAsyncMiddleware(signup),
  handleMiddlewareError
);
