/**
 * Schema naming convention - <controller>Schema (without the Ctrl suffix)
 */

import { object, TypeOf } from "zod";
import {
  zodChapterDescription,
  zodChapterEmoji,
  zodChapterId,
  zodChapterTitle,
  zodCourseId,
  zodInstructorId,
} from "./base.schema";

// =================================
// SCHEMAS
// =================================

export const createChapterSchema = object({
  body: object({
    title: zodChapterTitle,
    description: zodChapterDescription,
  }),
  params: object({
    courseId: zodCourseId,
    instructorId: zodInstructorId,
  }),
});

export const updateChapterSchema = object({
  body: object({
    emoji: zodChapterEmoji,
    title: zodChapterTitle,
    description: zodChapterDescription,
  }),
  params: object({
    courseId: zodCourseId,
    chapterId: zodChapterId,
  }),
});

// =================================
// TYPES
// =================================

export type CreateChapterInput = TypeOf<typeof createChapterSchema>;
export type UpdateChapterInput = TypeOf<typeof updateChapterSchema>;
