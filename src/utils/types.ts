import { NextFunction, Request, Response } from "express";

/**
 * Basic controller type where its not async and nor a middleware
 *
 * @param req Express request
 * @param res Express response
 * @returns void
 */
export type Controller = (req: Request, res: Response) => void;

/**
 * Middleware type where async is used
 *
 * @param req Express request
 * @param res Express response
 * @param next Express next function
 * @returns Promise<void>
 */
export type AsyncMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

/**
 * Middleware type where async is not used
 *
 * @param req Express request
 * @param res Express response
 * @param next Express next function
 * @returns void
 */
export type Middleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => void;

/**
 * Middleware type where async is used and an `id` as route param is passed
 *
 * @param req Express request
 * @param res Express response
 * @param next Express next function
 * @param id Route param id
 * @returns Promise<void>
 */
export type AsyncMiddlwareWithId = (
  req: Request,
  res: Response,
  next: NextFunction,
  id: string
) => Promise<void>;
