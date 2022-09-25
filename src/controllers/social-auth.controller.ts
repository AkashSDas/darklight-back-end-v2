import { Request, Response } from "express";
import { AddPostOAuthUserInfoSchemaInputBody } from "../schema/social-auth.schema";
import { deleteUserService, updateUserService } from "../services/user.service";

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
  await updateUserService({ _id: req.user._id }, { username, email, fullName });

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
  await deleteUserService({ _id: req.user?._id });

  req.logOut &&
    req.logOut(() => {
      return sendResponseToClient(res, {
        status: 200,
        error: false,
        msg: "User social auth info removed",
      });
    });
};

export const loginWithGoogle = () => {};
export const loginWithGoogleRedirect = () => {};

export const signupWithFacebook = () => {};
export const signupWithFacebookRedirect = () => {};

export const loginWithFacebook = () => {};
export const loginWithFacebookRedirect = () => {};

export const signupWithTwitter = () => {};
export const signupWithTwitterRedirect = () => {};

export const loginWithTwitter = () => {};
export const loginWithTwitterRedirect = () => {};
