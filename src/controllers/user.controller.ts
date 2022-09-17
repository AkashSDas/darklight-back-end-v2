import { Request, Response } from "express";
import {
  CheckEmailAvaiableInputParams,
  CheckUsernameAvaiableInputParams,
} from "../schema/user.schema";
import { userExists } from "../services/user.service";
import { sendResponseToClient } from "../utils/client-response";

/**
 * Check if the username is available or not
 * @param req Express request object with `CheckUsernameAvaiableInputParams` type
 * @param res Express response object
 *
 * @route GET /user/check-username-avaiable/:username
 */
export const checkUsernameAvaiable = async (
  req: Request<CheckUsernameAvaiableInputParams>,
  res: Response
) => {
  const exists = await userExists({ username: req.params.username });
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
  req: Request<CheckEmailAvaiableInputParams>,
  res: Response
) => {
  const exists = await userExists({ email: req.params.email });
  sendResponseToClient(res, {
    status: 200,
    error: false,
    msg: "Email availability",
    data: { available: exists === 0 },
  });
};
