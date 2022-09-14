import cors from "cors";
import express from "express";
import morgan from "morgan";

import { sendResponseToClient } from "./utils/client-response";

/**
 * @description Express app
 */
export const app = express();

// Middlewares
app.use(cors()); // Enable CORS
app.use(morgan("tiny")); // Log requests to the console
app.use(express.json()); // for parsing incoming data
app.use(express.urlencoded({ extended: true })); // parses incoming requests with urlencoded payloads

// Routes

// Test route
// app.get("/api/test", (_, res: Response) => {
//   res.status(200).json({ msg: "🌗 DarkLight back-end (REST APIs)" });
// });

app.use("/api/base-auth", require("./routes/base-auth.route").router);
app.all("*", (req, res) => {
  sendResponseToClient(res, {
    status: 404,
    error: true,
    msg: `Cannot find ${req.originalUrl} on this server!`,
  });
});
