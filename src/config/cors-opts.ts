import { allowedOrigins } from "./allowed-origins";

export const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  // origin: "*", // for Postman
  credentials: true,
  optionsSuccessStatus: 200,
};
