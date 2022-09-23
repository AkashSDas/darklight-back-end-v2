import { Request, Response } from "express";
import logger from "../logger";
import { CreateBaseCourseInputBody } from "../schema/course.schema";
import { createCourse } from "../services/course.service";
import { getUser } from "../services/user.service";
import { sendResponseToClient } from "../utils/client-response";
import { UserRole } from "../utils/user";

/**
 * Create a brand new course with the required fields
 * @remarks For only one instructor
 * @remarks Inside req.body, the instructors will be users will instructor
 * roles and the array will be user.userId and not user._id
 */
export const createBaseCourse = async (
  req: Request<{}, {}, CreateBaseCourseInputBody>,
  res: Response
) => {
  const { title, description, instructors, courseLevel } = req.body;

  // Check if instructors exists OR not
  let instructorSearch = [];
  for (let uid of instructors) {
    instructorSearch.push(
      getUser({ userId: uid, roles: { $in: UserRole.INSTRUCTOR } })
    );
  }
  const users = await Promise.all(instructorSearch);
  const exists = users.some((u) => u !== null);

  if (!exists) {
    return sendResponseToClient(res, {
      status: 400,
      error: true,
      msg: "Either instructor(s) don't exists OR don't have permission to create courses",
    });
  }

  // Create the course
  const uids = users.map((u) => u._id);
  const course = await createCourse({
    title,
    description,
    instructors: uids,
    courseLevel: courseLevel as any,
  });

  sendResponseToClient(res, {
    status: 200,
    error: false,
    msg: "Course created successfully",
    data: { course },
  });
};
