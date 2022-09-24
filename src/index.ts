import { config } from "dotenv";

// Load env variables
if (process.env.NODE_ENV !== "production") config();

import { app } from "./api";
import { cloudinaryConfig } from "./config/cloudinary";
import { connectToMongoDB } from "./config/db";
import logger from "./logger";

// Connect to MongoDB
connectToMongoDB();

// Connect to cloudinary
cloudinaryConfig();

// Start the server
const port = process.env.PORT || 8002;
app.listen(port, () =>
  logger.info(`API is available on http://localhost:${port}/api`)
);
