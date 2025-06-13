import express from "express";
import morgan from "morgan";
import globalErrorHandler from "./middlewares/error.middleware.js";
import rateLimit from "express-rate-limit";

const app = express();

// 1) Global middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many request from this IP, please try again in an hour",
});

app.use("/api", limiter); // only apply to api routes
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// routes

import tourRouter from "./routes/tour.route.js";
import userRoute from "./routes/user.route.js";

app.use("/api/v1/tours", tourRouter());
app.use("/api/v1/users", userRoute());

// error handler middleware for all routes
app.all("*", (req, res, next) => {
  // return res
  //   .status(404)
  //   .json(new ApiError(404, [], `${req.originalUrl} Not Found`));

  const err = new ApiError(404, `${req.originalUrl} Not Found`);
  next(err);
});

// error handler middleware
app.use(globalErrorHandler);

export { app };
