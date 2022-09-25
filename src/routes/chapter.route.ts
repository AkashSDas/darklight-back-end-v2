import { Router } from "express";
import {
  createChapterCtrl,
  updateChapterCtrl,
} from "../controllers/chapter.controller";
import { validateResource } from "../middlewares/validate-resource.middleware";
import { verifyAuth } from "../middlewares/verify-auth";
import { createChapterSchema } from "../schema/chapter.schema";
import { handleAsyncMiddleware } from "../utils/handle-async";
import { handleMiddlewareError } from "../utils/handle-error";

export const router = Router();

router
  .post(
    "/:courseId/:instructorId",
    validateResource(createChapterSchema),
    handleAsyncMiddleware(verifyAuth),
    handleAsyncMiddleware(createChapterCtrl),
    handleMiddlewareError
  )
  .put(
    "/:courseId/:chapterId",
    handleAsyncMiddleware(verifyAuth),
    handleAsyncMiddleware(updateChapterCtrl),
    handleMiddlewareError
  );
