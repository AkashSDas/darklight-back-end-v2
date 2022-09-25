import { Request, Response } from "express";
import mongoose from "mongoose";
import {
  CreateChapterInput,
  UpdateChapterInput,
} from "../schema/chapter.schema";
import {
  createChapterService,
  getChapterService,
} from "../services/chapter.service";
import { getCourseHavingInstructorService } from "../services/course.service";
import { sendResponseToClient } from "../utils/client-response";

/** Create a new chapter */
export const createChapterCtrl = async (
  req: Request<CreateChapterInput["params"], {}, CreateChapterInput["body"]>,
  res: Response
) => {
  const { description, title } = req.body;
  const { courseId, instructorId } = req.params;

  // Find a course with this course._id and instructor._id
  const course = await getCourseHavingInstructorService(
    courseId,
    new mongoose.Types.ObjectId(instructorId)
  );
  if (!course) {
    return sendResponseToClient(res, {
      status: 404,
      error: true,
      msg: "No such user OR course",
    });
  }

  // Create chapter
  const chapter = await createChapterService({
    title,
    description,
    courseId: new mongoose.Types.ObjectId(courseId),
    order: 1,
  });

  sendResponseToClient(res, {
    status: 200,
    error: false,
    msg: "Chapter created successfully",
    data: { chapter },
  });
};

/**
 * @remarks The user should be an instructor of the course of which
 * the chapter belongs to
 *
 * @remarks You cannot update the instructor (as of now)
 */
export const updateChapterCtrl = async (
  req: Request<UpdateChapterInput["params"], {}, UpdateChapterInput["body"]>,
  res: Response
) => {
  const { emoji, title, description } = req.body;
  const { courseId, chapterId } = req.params;

  // Check if the course exists and the user making update is an
  // instructor of that course OR not
  const course = await getCourseHavingInstructorService(courseId, req.user._id);
  if (course) {
    return sendResponseToClient(res, {
      status: 200,
      error: false,
      msg: "Either course doesn't exists OR the user is not an instructor of the course",
    });
  }

  // Check if the chapter exists OR not
  const chapter = await getChapterService(chapterId);
  if (!chapter) {
    return sendResponseToClient(res, {
      status: 404,
      error: true,
      msg: "No such chapter exists",
    });
  }

  // Update the chapter
  chapter.emoji = emoji ?? chapter.emoji;
  chapter.title = title ?? chapter.title;
  chapter.description = description ?? chapter.description;
  await chapter.save();

  sendResponseToClient(res, {
    status: 200,
    error: false,
    msg: "Chapter updated successfully",
    data: { chapter },
  });
};
