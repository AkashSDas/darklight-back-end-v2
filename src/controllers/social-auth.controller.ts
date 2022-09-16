import { Request, Response } from "express";
import logger from "../logger";

import { sendResponseToClient } from "../utils/client-response";
import { BaseApiError } from "../utils/handle-error";

export const getLoggedInUser = async (req: Request, res: Response) => {
  sendResponseToClient(res, {
    status: 200,
    error: false,
    msg: "Logged in user",
    data: { user: req.user },
  });
};

export const signupWithGoogle = () => {};
export const signupWithGoogleRedirect = () => {};
