/**
 * Client response module
 * @module /src/utils/client-response.ts
 *
 * @description Define utils for handling client responses
 */

import { Response } from "express";

interface ClientResponseOptions {
  /** Status code for the response */
  status: number;
  /** Data (message) sent to the client */
  msg: string;
  /** Additional data to send to the client (optional) */
  data?: { [key: string]: any };
}

/**
 * @param {Response} res Response to send to the client
 * @param {ClientResponseOptions} options Options for the response
 * @returns {void} void
 * @example
 * sendResponse(res, { status: 200, msg: "Success" })
 */
export function sendResponse(
  res: Response,
  options: ClientResponseOptions
): void {
  var { status, msg, data } = options;
  res.status(status).json({ msg, data });
}
