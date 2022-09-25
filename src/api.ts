import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import passport from "passport";
import session from "express-session";
import fileUpload from "express-fileupload";

import { corsOptions } from "./config/cors-opts";
import { sendResponseToClient } from "./utils/client-response";

// OAuth Passport Strategies
import "./passport/google-signup.strategy";
import "./passport/google-login.strategy";
import "./passport/facebook-signup.strategy";
import "./passport/facebook-login.strategy";
import "./passport/twitter-signup.strategy";
import "./passport/twitter-login.strategy";

/** Express app */
export const app = express();

// Middlewares
app.use(cors(corsOptions)); // Enable CORS
app.use(morgan("tiny")); // Log requests to the console
app.use(express.json()); // for parsing incoming data
app.use(express.urlencoded({ extended: true })); // parses incoming requests with urlencoded payloads
app.use(cookieParser()); // Parse Cookie header and populate req.cookies with an object keyed by the cookie names
app.use(passport.initialize());
app.use(
  session({
    secret: process.env.COOKIE_SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.session());
app.use(fileUpload({ useTempFiles: true, tempFileDir: "/tmp/" }));

// Routes
app.use("/api/base-auth", require("./routes/base-auth.route").router);
app.use("/api/social-auth", require("./routes/social-auth.route").router);
app.use("/api/user", require("./routes/user.route").router);
app.use("/api/course", require("./routes/course.route").router);
app.use("/api/chapter", require("./routes/chapter.route").router);
app.all("*", (req, res) => {
  sendResponseToClient(res, {
    status: 404,
    error: true,
    msg: `Cannot find ${req.originalUrl} on this server!`,
  });
});
