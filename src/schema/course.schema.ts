import { number, object, string, TypeOf } from "zod";
import { CourseLevel } from "../models/course.model";

export const createBaseCourseSchema = object({
  body: object({
    title: string({ required_error: "Course name is required" })
      .max(240, "Course name must be less than 240 characters")
      .min(3, "Course name should be more than 3 characters"),
    description: string({
      required_error: "Course description is required",
    })
      .min(3, "Course description should be more than 3 characters")
      .max(1024, "Course description must be less than 1024 characters"),
    instructors: string({
      required_error: "Course authors are required",
    })
      .array()
      .nonempty("Atleast one author is required"),
    courseLevel: string({
      required_error: "Course level is required",
    }).refine((value) => {
      return Object.values(CourseLevel).includes(value as any);
    }, "Invalid course level"),
  }),
});

export const updateCourseMetaInfoSchema = object({
  body: object({
    title: string()
      .max(240, "Course name must be less than 240 characters")
      .min(3, "Course name should be more than 3 characters"),
    description: string()
      .min(3, "Course description should be more than 3 characters")
      .max(1024, "Course description must be less than 1024 characters"),
    courseLevel: string().refine((value) => {
      return Object.values(CourseLevel).includes(value as any);
    }, "Invalid course level"),
    tags: string().array(),
    price: number().min(0, "Invalid price"),
  }),
  params: object({
    courseId: string({ required_error: "Course ID is required" }).length(
      12, // check course model for this
      "Invalid course id"
    ),
  }),
});

export const getCourseMetaInfoSchema = object({
  params: object({
    courseId: string({ required_error: "Course ID is required" }).length(
      12, // check course model for this
      "Invalid course id"
    ),
  }),
});

export type CreateBaseCourseInputBody = TypeOf<
  typeof createBaseCourseSchema
>["body"];
export type UpdateCourseMetaInfoInput = TypeOf<
  typeof updateCourseMetaInfoSchema
>;
export type GetCourseMetaInfoInputParams = TypeOf<
  typeof getCourseMetaInfoSchema
>["params"];
