import { object, string, TypeOf } from "zod";

export const createChapterSchema = object({
  body: object({
    title: string({
      required_error: "Title is required",
    })
      .max(240, "Course name must be less than 240 characters")
      .min(3, "Course name should be more than 3 characters"),
    description: string({
      required_error: "Description is required",
    })
      .min(3, "Course description should be more than 3 characters")
      .max(1024, "Course description must be less than 1024 characters"),
  }),
  params: object({
    courseId: string({ required_error: "Course ID is required" }).length(
      12, // check course model for this
      "Invalid course id"
    ),
    instructorId: string({
      // user mongodb _id
      required_error: "Instructor ID is required",
    }),
  }),
});

export type CreateChapterInput = TypeOf<typeof createChapterSchema>;
