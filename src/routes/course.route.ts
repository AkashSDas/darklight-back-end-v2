import { Router } from "express";
import {
  createBaseCourse,
  getCourseMetaInfo,
  updateCourseMetaInfo,
} from "../controllers/course.controller";
import { validateResource } from "../middlewares/validate-resource.middleware";
import { verifyAuth } from "../middlewares/verify-auth";
import { createBaseCourseSchema } from "../schema/course.schema";
import { handleAsyncMiddleware } from "../utils/handle-async";
import { handleMiddlewareError } from "../utils/handle-error";

export const router = Router();

router
  .post(
    "/create-base-course",
    validateResource(createBaseCourseSchema),
    handleAsyncMiddleware(verifyAuth),
    handleAsyncMiddleware(createBaseCourse),
    handleMiddlewareError
  )
  .put(
    "/:courseId",
    handleAsyncMiddleware(verifyAuth),
    handleAsyncMiddleware(updateCourseMetaInfo),
    handleMiddlewareError
  )
  .get(
    "/:courseId",
    handleAsyncMiddleware(getCourseMetaInfo),
    handleMiddlewareError
  );
