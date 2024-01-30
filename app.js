import express from "express";
import morgan from "morgan";
const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// routes

import tourRouter from "./routes/tours.route.js";

app.use("/api/v1/tours", tourRouter);

export { app };
