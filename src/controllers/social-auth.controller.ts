import { Request, Response } from "express";
import { AddPostOAuthUserInfoSchemaInputBody } from "../schema/social-auth.schema";
import { deleteUser, updateUser } from "../services/user.service";

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

export const addPostOAuthUserInfo = async (
  req: Request<{}, {}, AddPostOAuthUserInfoSchemaInputBody>,
  res: Response
) => {
  const { username, email, fullName } = req.body;
  await updateUser({ _id: req.user._id }, { username, email, fullName });

  sendResponseToClient(res, {
    status: 200,
    error: false,
    msg: "User info updated",
    data: { username, email, fullName },
  });
};

export const socialLogout = async (req: Request, res: Response) => {
  req.logOut &&
    req.logOut(() => {
      return sendResponseToClient(res, {
        status: 200,
        error: false,
        msg: "User logged out",
      });
    });
};

export const cancelSocialAuth = async (req: Request, res: Response) => {
  await deleteUser({ _id: req.user?._id });

  req.logOut &&
    req.logOut(() => {
      return sendResponseToClient(res, {
        status: 200,
        error: false,
        msg: "User social auth info removed",
      });
    });
};
