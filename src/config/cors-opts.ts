import { allowedOrigins } from "./allowed-origins";

export const corsOptions = {
  // origin: (origin, callback) => {
  //   if (allowedOrigins.indexOf(origin) !== -1) {
  //     callback(null, true);
  //   } else {
  //     callback(new Error("Not allowed by CORS"));
  //   }
  // },
  // origin: "*", // for Postman
  origin: process.env.FRONTEND_BASE_URL,
  credentials: true,
  optionsSuccessStatus: 200,
};
