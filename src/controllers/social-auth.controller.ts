import { Request, Response } from "express";
import { UpdateUsernameInputBody } from "../schema/social-auth.schema";
import { updateUser } from "../services/user.service";

import { sendResponseToClient } from "../utils/client-response";

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

export const updateUsername = async (
  req: Request<{}, {}, UpdateUsernameInputBody>,
  res: Response
) => {
  const { username } = req.body;
  await updateUser({ _id: req.user._id }, { username });

  sendResponseToClient(res, {
    status: 200,
    error: false,
    msg: "Username updated",
  });
};
