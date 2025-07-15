import express from "express";
import morgan from "morgan";
import cors from "cors";
import globalErrorHandler from "./middlewares/errorHandler.middleware.js";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import ExpressMongoSanitize from "express-mongo-sanitize";
import xssclean from "xss-clean";
import hpp from "hpp";
import { env } from "../config/serverConfig.js";

const app = express();

// 1) Global middleware
// set security http header
app.use(helmet());
// development env
if (env.NODE_ENV === "development") {
  console.log("inside morgan dev");
  app.use(morgan("dev"));
}
// limit request from same IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many request from this IP, please try again in an hour",
});

app.use("/api", limiter); // only apply to api routes

app.use(
  cors({
    origin: env.ORIGIN,
    optionsSuccessStatus: 200,
  })
);
// body parser, reading data from the body into req.body
app.use(express.json({ limit: "16kb" }));
// data sanitization against NoSQL query injection
app.use(ExpressMongoSanitize());
// data sanitization against XSS
app.use(xssclean());
// prevent params pollution
app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsQuantity",
      "ratingsAverage",
      "maxGroupSize",
      "difficulty",
      "price",
    ],
  })
);

app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

// routes

import { reviewRouter, userRouter, tourRouter } from "./routes/index.js";

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);

// 3) Catch-all route for unhandled routes (MUST come before error handler)
app.all("*", (req, res, next) => {
  const err = new ApiError(404, `${req.originalUrl} Not Found`);
  next(err);
});

// 4) Global error handler middleware (MUST be the very last middleware)
app.use(globalErrorHandler);
export { app };
