/**
 * Handle async module
 * @module /src/utils/handle-async.ts
 *
 * @version 1.0.0
 * @description Utils for handling async operations
 */

import { NextFunction, Request, Response } from "express";

import logger from "../logger";
import { AsyncMiddleware } from "./types";

/**
 * @param promise A promise whose error needs to be handled
 * @param [logError=true] Whether to log the error or not (default: true, optional)
 * @param [errorId] A unique id to identify `this` error (optional)
 *
 * @returns A promise whose value is `[error, result]`. If there is no error then the
 * error will be `null` and the result will be the resolved value of the promise. If
 * there is an error then the error will be the error object and the result will be
 * `null`.
 */

export const handleAsync = async (
  promise: Promise<any>,
  logError: boolean = true,
  errorId?: string
): Promise<any[]> => {
  try {
    const result = await promise;
    return [null, result];
  } catch (err) {
    if (logError) logger.error(errorId ?? "", err);
    return [null, err];
  }
};

/**
 * @description The returned middleware will catch any errors and pass them to the
 * next middleware. If no error then it will function accordingly. Therefore the
 * `fn` (i.e. input) can be controller as well as middleware.
 *
 * @param fn A middleware OR controller function that returns a promise
 * @returns The given middleware function is returned along with error handling
 */
export const handleAsyncMiddleware = (fn: AsyncMiddleware): AsyncMiddleware => {
  return (req: Request, res: Response, next: NextFunction): Promise<void> => {
    return fn(req, res, next).catch(next);
  };
};
