import mongoose from "mongoose";
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

export const getCourseWithInstructor = async (
  courseId: string,
  instructorId: string
) => {
  return await CourseModel.findOne({
    courseId,
    instructors: { $in: new mongoose.Types.ObjectId(instructorId) },
  }).exec();
};

/**
 * @param id Course mongodb _id
 * @param instructorId User mongodb _id (this user should have instructor role)
 * @returns Course
 */
export const getCourseHavingInstructorService = async (
  id: string,
  instructorId: mongoose.Types.ObjectId
) => {
  return await CourseModel.findOne({
    _id: id,
    instructors: { $in: instructorId },
  }).exec();
};
