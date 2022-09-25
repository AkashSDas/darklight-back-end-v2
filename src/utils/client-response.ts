/**
 * Handle responses send to client
 * @module /src/utils/client-response.ts
 */

import { Response } from "express";

/** Options for sending response to the client */
interface ClientResponseOptions {
  /** Status code for the response */
  status: number;

  /** Whether the response is an error or not */
  error: boolean;

  /** Message for the response */
  msg: string;

  /** Data for the response (optional) */
  data?: { [key: string]: any };
}

/**
 * Send response to the client
 *
 * @param {Response} res Express response
 * @param {ClientResponseOptions} opts Options for the response
 * @returns void
 * @example
 * sendResponseToClient(res, { status: 200, msg: "Success" });
 */
export const sendResponseToClient = (
  res: Response,
  opts: ClientResponseOptions
): void => {
  const { status, error, msg, data } = opts;
  res.status(status).json({ error, msg, data });
};
