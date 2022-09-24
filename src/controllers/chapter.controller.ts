import { Request, Response } from "express";
import { CreateChapterInput } from "../schema/chapter.schema";
import { createChapterService } from "../services/chapter.service";
import { getCourseWithInstructor } from "../services/course.service";
import { sendResponseToClient } from "../utils/client-response";

export const createChapter = async (
  req: Request<CreateChapterInput["params"], {}, CreateChapterInput["body"]>,
  res: Response
) => {
  const { description, title } = req.body;
  const { courseId, instructorId } = req.params;

  // Find course with this course id and instructor id
  const course = await getCourseWithInstructor(courseId, instructorId);
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
    courseId: courseId as any,
  });

  sendResponseToClient(res, {
    status: 200,
    error: false,
    msg: "Chapter created successfully",
    data: { chapter },
  });
};
