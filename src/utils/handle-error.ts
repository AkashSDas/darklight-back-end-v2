/**
 * Handle errors module
 * @module /src/utils/handle-error.ts
 *
 * @version 1.0.0
 * @description Utils for handling errors
 */

import { NextFunction, Request, Response } from "express";

import logger from "../logger";
import { sendResponseToClient } from "./client-response";

/**
 * Useful to throw errors while working with controllers. This error can be caught
 * by the `handleMiddlewareError` function and can send appropriate response to
 * the client.
 *
 * @example
 * throw new BaseApiError(404, "User not found");
 */
export class BaseApiError extends Error {
  public msg: string;
  public status: number;
  public isOperational: boolean;

  constructor(status: number, msg: string) {
    super(msg);

    this.msg = msg;
    this.status = status;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Handle API errors
 *
 * @param {unknown} err Unknown error (can be any type and even not be there if no error)
 * @param {Request} req Express request
 * @param {Response} res Express response
 * @param {NextFunction} next Express Next function
 * @returns void
 *
 * @example
 * app.use(handleMiddlewareError);
 *
 * @example
 * route.get('/route', handleMiddlewareError(controller));
 */
export const handleMiddlewareError = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err instanceof BaseApiError) {
    sendResponseToClient(res, {
      status: err.status,
      error: true,
      msg: err.msg,
    });
  }

  logger.error(err);
  const status = (err as any)?.status || 400;
  const msg = (err as any)?.msg || "Something went wrong, Please try again";
  sendResponseToClient(res, { status, msg, error: true });
};
