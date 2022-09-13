/**
 * Logger Format Module
 * @module /src/logger/format.ts
 *
 * @version 1.0.0
 * @description Formats for loggers are handled and exported from here.
 */

import { format } from "winston";

/**
 * @constant {Format} customFormat base logger's format
 * @example Format - [info] 12:00:00
 */
export const baseFormat = format.printf(({ level, message, timestamp }) => {
  return `[${level}] ${timestamp} ${message}`;
});
