import express from "express";
import morgan from "morgan";
import globalErrorHandler from "./middlewares/error.middleware.js";
const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// routes

import tourRouter from "./routes/tour.route.js";

app.use("/api/v1/tours", tourRouter);

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
