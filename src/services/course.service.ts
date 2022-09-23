import { CourseClass, CourseModel } from "../models/course.model";

export const createCourse = async (data: Partial<CourseClass>) => {
  const course = new CourseModel(data);
  return await course.save();
};
