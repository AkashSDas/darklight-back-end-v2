import { CourseClass, CourseModel } from "../models/course.model";

export const createCourse = async (data: Partial<CourseClass>) => {
  const course = new CourseModel(data);
  return await course.save();
};

export const updateCourseService = async (
  courseId: string,
  data: Partial<CourseClass>
) => {
  return await CourseModel.findOneAndUpdate({ courseId }, data, {
    new: true,
    runValidators: true,
  });
};

export const getCourseService = async (courseId: string) => {
  return await CourseModel.findOne({ courseId }).exec();
};
