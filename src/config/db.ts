import { connect } from "mongoose";

import logger from "../logger";

/**
 * Connect to MongoDB
 * @returns {Promise<void>} Promise that resolves to void
 */
export const connectToMongoDB = async (): Promise<void> => {
  try {
    await connect(process.env.MONGODB_CONNECT_URL);
    logger.info("Connected to MongoDB Atlas");
  } catch (err) {
    logger.error(`Couldn't connect to MongoDB Atlas\nError: ${err}`);
    process.exit(1);
  }
};
