import { object, TypeOf } from "zod";
import {
  zodCourseCourseLevel,
  zodCourseDescription,
  zodCourseId,
  zodCourseInstructors,
  zodCoursePrice,
  zodCourseTags,
  zodCourseTitle,
} from "./base.schema";

// =================================
// SCHEMAS
// =================================

export const createBaseCourseSchema = object({
  body: object({
    title: zodCourseTitle,
    description: zodCourseDescription,
    instructors: zodCourseInstructors,
    courseLevel: zodCourseCourseLevel,
  }),
});

export const updateCourseMetaInfoSchema = object({
  body: object({
    title: zodCourseTitle,
    description: zodCourseDescription,
    courseLevel: zodCourseCourseLevel,
    tags: zodCourseTags,
    price: zodCoursePrice,
  }),
  params: object({ courseId: zodCourseId }),
});

export const getCourseMetaInfoSchema = object({
  params: object({ courseId: zodCourseId }),
});

// =================================
// TYPES
// =================================

export type CreateBaseCourseInput = TypeOf<typeof createBaseCourseSchema>;
export type UpdateCourseMetaInfoInput = TypeOf<
  typeof updateCourseMetaInfoSchema
>;
export type GetCourseMetaInfoInput = TypeOf<typeof getCourseMetaInfoSchema>;
