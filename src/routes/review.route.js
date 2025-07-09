import express from "express";
import { reviewController } from "../controllers/review.controller.js";
import { authController } from "../controllers/auth.controller.js";

const router = express.Router();

router
  .route("/")
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrict("user"),
    reviewController.createReview
  );

export default router;
