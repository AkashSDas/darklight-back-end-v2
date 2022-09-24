import { Request, Response } from "express";
import {
  CreateBaseCourseInputBody,
  UpdateCourseMetaInfoInput,
} from "../schema/course.schema";
import {
  createCourse,
  getCourseService,
  updateCourseService,
} from "../services/course.service";
import { getUser } from "../services/user.service";
import { sendResponseToClient } from "../utils/client-response";
import { deleteAnImage, uploadAnImage } from "../utils/cloudinary";
import { UserRole } from "../utils/user";
import { UploadedFile } from "express-fileupload";
import { BaseApiError } from "../utils/handle-error";

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

/**
 * @remarks Instructor cannot be changed using this controller
 * @remarks For the coverImg file use the `coverImg` name in the `input`
 */
export const updateCourseMetaInfo = async (
  req: Request<
    UpdateCourseMetaInfoInput["params"],
    {},
    UpdateCourseMetaInfoInput["body"]
  >,
  res: Response
) => {
  const { courseLevel, description, title, price, tags } = req.body;
  const coverImg = req.files?.coverImg;
  let updatedData: { [key: string]: any } = {
    courseLevel,
    description,
    title,
    price,
    tags,
  };

  // Check if the course exists or not
  const course = await getCourseService(req.params.courseId);
  if (!course) {
    throw new BaseApiError(404, "Course does not exists");
  }

  if (coverImg) {
    // Check if the authenticated user already has an profile pic OR not
    let promises = [];
    if (course.coverImage) {
      promises.push(deleteAnImage(course.coverImage.id));
    }

    // Upload the img to cloudinary
    promises.push(
      uploadAnImage(
        (coverImg as UploadedFile).tempFilePath,
        `${process.env.CLOUDINARY_ROOT_COURSE_DIR}/${course._id}`
      )
    );

    // If course.coverImage is null then result will directly be the uploaded image info
    // else the result will be an array
    const result = await Promise.all(promises);
    if (result.length == 1) {
      updatedData.coverImage = { id: result[0].id, URL: result[0].URL };
    } else {
      // result.length == 2
      updatedData.coverImage = {
        id: result[1].id,
        URL: result[1].URL,
      };
    }
  }

  const updatedCourse = await updateCourseService(
    req.params.courseId,
    updatedData
  );

  if (!updatedCourse) {
    return sendResponseToClient(res, {
      status: 500,
      error: true,
      msg: "Something went wrong, Please try again",
    });
  }

  return sendResponseToClient(res, {
    status: 200,
    error: false,
    msg: "Successfully updated the course",
    data: { course: updatedCourse },
  });
};
