/**
 * Schema fields that are same and repeated across other schemas
 *
 * Field naming convention: zod<entity><field_name>
 */

import { number, string } from "zod";
import { CourseLevel } from "../models/course.model";

// =====================================
// USER
// =====================================

export const zodUserFullName = string({
  required_error: "Fullname is required",
})
  .max(240, "Fullname must be less than 240 characters")
  .min(6, "Fullname should be more than 6 characters");

export const zodUserUsername = string({
  required_error: "Username is required",
})
  .max(120, "Username must be less than 120 characters")
  .min(3, "Username should be more than 3 characters");

export const zodUserEmail = string({
  required_error: "Email is required",
}).email("Invalid email");

export const zodUserPassword = string({
  required_error: "Password is required",
}).min(6, "Password must be more than 6 characters");

export const zodUserConfirmPassword = string({
  required_error: "Confirm password is required",
});

// =====================================
// CHAPTER
// =====================================

export const zodChapterEmoji = string({
  required_error: "Emoji is required",
}).length(1, "Emoji must be a single character");

export const zodChapterTitle = string({
  required_error: "Title is required",
})
  .max(240, "Course name must be less than 240 characters")
  .min(3, "Course name should be more than 3 characters");

export const zodChapterDescription = string({
  required_error: "Description is required",
})
  .min(3, "Chapter description should be more than 3 characters")
  .max(1024, "Chapter description must be less than 1024 characters");

// =====================================
// COURSE
// =====================================

export const zodCourseTitle = string({
  required_error: "Course name is required",
})
  .max(240, "Course name must be less than 240 characters")
  .min(3, "Course name should be more than 3 characters");

export const zodCourseDescription = string({
  required_error: "Description is required",
})
  .min(3, "Course description should be more than 3 characters")
  .max(1024, "Course description must be less than 1024 characters");

export const zodCourseInstructors = string({
  required_error: "Course author is required",
})
  .array()
  .nonempty("At least one author is required");

export const zodCourseCourseLevel = string({
  required_error: "Course level is required",
}).refine((value) => {
  return Object.values(CourseLevel).includes(value as any);
}, "Invalid course level");

export const zodCourseTags = string().array();

export const zodCoursePrice = number().min(0, "Invalid price");

// =====================================
// COMMON
// =====================================

export const zodCourseId = string({
  required_error: "Course id is required",
});

export const zodChapterId = string({
  required_error: "Chapter id is required",
});

export const zodInstructorId = string({
  required_error: "Instructor id is required",
});

export const zodUserId = string({
  required_error: "User id is required",
});
