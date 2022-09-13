/**
 * Logger Module
 * @module /src/logger/index.ts
 *
 * @version 1.0.0
 * @description App logger is exported from here.
 */

import { Logger } from "winston";

import { developmentLogger } from "./development";
import { productionLogger } from "./production";

/**
 * @description Logger for the app. Two types - production and dev
 */
let logger: Logger = null;

if (process.env.NODE_ENV !== "production") {
  logger = developmentLogger();
} else {
  logger = productionLogger();
}

export default logger;
