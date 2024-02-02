import express from "express";
import morgan from "morgan";
const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// routes

import tourRouter from "./routes/tour.route.js";

app.use("/api/v1/tours", tourRouter);
app.all("*", (req, res, next) => {
  return res.status(404).json({
    success: false,
    message: `Can't find ${req.originalUrl} on this server`,
  });
});
export { app };
