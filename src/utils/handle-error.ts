/**
 * API Error Handling Module
 * @module /src/utils/handle-error.ts
 * @description Defines the error handling utils for the API
 */

import { Request, Response } from "express";

import { sendResponse } from "./client-response";

/**
 * API error class
 * @example throw new BaseApiError(404, "User not found");
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
 * @param {Response} res Express response
 * @returns {void} void
 *
 * @example
 * app.use(handleMiddlewareError);
 *
 * @example
 * route.get('/route', handleMiddlewareError(controller));
 */
export function handleCtrlError(err: unknown, _: Request, res: Response): void {
  var status = (err as any)?.status || 400;
  var msg = (err as any)?.msg || "Something went wrong, Please try again";
  sendResponse(res, { status, msg });
}
