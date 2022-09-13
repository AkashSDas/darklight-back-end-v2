/**
 * Production Logger Module
 * @module /src/logger/production.ts
 *
 * @version 1.0.0
 * @description The logger for the production environment is handled and exported from here.
 */

import { createLogger, format, Logger, transports } from "winston";

import { baseFormat } from "./format";

/**
 * @returns {Logger} logger for the production environment
 */
export const productionLogger = (): Logger => {
  return createLogger({
    level: "info",
    format: format.combine(
      format.timestamp(), // we want server timestamp for server in production
      baseFormat
    ),
    transports: [
      new transports.Console({}),
      new transports.File({ filename: "./logs/error.log", level: "error" }),
    ],
  });
};
