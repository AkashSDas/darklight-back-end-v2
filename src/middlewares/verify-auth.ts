import { BaseApiError } from "../utils/handle-error";
import { AsyncMiddleware } from "../utils/types";

export const verifyAuth: AsyncMiddleware = async (req, res, next) => {
  console.log(req.user);

  if (req.user) return next();
  throw new BaseApiError(401, "You are not logged in");
};
