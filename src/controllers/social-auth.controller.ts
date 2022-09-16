import { Request, Response } from "express";

import { sendResponseToClient } from "../utils/client-response";

export const getLoggedInUser = async (req: Request, res: Response) => {
  sendResponseToClient(res, {
    status: 200,
    error: false,
    msg: "Logged in user",
    data: { user: req.user },
  });
};

export const signupWithGoogle = (req: Request, res: Response) => {
  sendResponseToClient(res, {
    status: 200,
    error: false,
    msg: "Signup with Google is initialized",
  });
};

export const signupWithGoogleRedirect = (req: Request, res: Response) => {
  sendResponseToClient(res, {
    status: 200,
    error: false,
    msg: "Signup with Google is redirect",
  });
};
