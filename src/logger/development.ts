/**
 * Development Logger Module
 * @module /src/logger/development.ts
 *
 * @version 1.0.0
 * @description The logger for the development environment is handled and exported from here.
 */

import { createLogger, format, Logger, transports } from "winston";

import { baseFormat } from "./format";

/**
 * @returns {Logger} logger for the development environment
 */
export const developmentLogger = (): Logger => {
  return createLogger({
    level: "debug",
    format: format.combine(
      format.colorize(),
      format.timestamp({ format: "HH:mm:ss" }),
      baseFormat
    ),
    transports: [new transports.Console({})],
  });
};
