import { Request, Response } from "express";
import {
  CheckEmailAvaiableInput,
  CheckUsernameAvaiableInput,
  SignupForInstructorInput,
} from "../schema/user.schema";
import { getUserService, userExistsService } from "../services/user.service";
import { sendResponseToClient } from "../utils/client-response";
import { UserRole } from "../utils/user";

/**
 * Check if the username is available or not
 * @param req Express request object with `CheckUsernameAvaiableInputParams` type
 * @param res Express response object
 *
 * @route GET /user/check-username-avaiable/:username
 */
export const checkUsernameAvaiable = async (
  req: Request<CheckUsernameAvaiableInput["params"]>,
  res: Response
) => {
  const exists = await userExistsService({ username: req.params.username });
  sendResponseToClient(res, {
    status: 200,
    error: false,
    msg: "Username availability",
    data: { available: exists === 0 },
  });
};

/**
 * Check if the email is available or not
 * @param req Express request object with `CheckEmailAvaiableInputParams` type
 * @param res Express response object
 *
 * @route GET /user/check-email-avaiable/:email
 */
export const checkEmailAvaiable = async (
  req: Request<CheckEmailAvaiableInput["params"]>,
  res: Response
) => {
  const exists = await userExistsService({ email: req.params.email });
  sendResponseToClient(res, {
    status: 200,
    error: false,
    msg: "Email availability",
    data: { available: exists === 0 },
  });
};

/**
 * This userId is the 'user.userId` and not the `user._id`
 */
export const signupForInstructor = async (
  req: Request<SignupForInstructorInput["params"]>,
  res: Response
) => {
  const userId = req.params.userId;
  const user = await getUserService({ userId: userId });
  if (!user) {
    return sendResponseToClient(res, {
      status: 404,
      error: true,
      msg: "User not found",
    });
  }

  if (user.roles.filter((role) => role === "instructor").length > 0) {
    return sendResponseToClient(res, {
      status: 400,
      error: true,
      msg: "User is already an instructor",
    });
  }

  user.roles.push(UserRole.INSTRUCTOR);
  await user.save();

  sendResponseToClient(res, {
    status: 200,
    error: false,
    msg: "Successfully signed up for instructor",
  });
};
