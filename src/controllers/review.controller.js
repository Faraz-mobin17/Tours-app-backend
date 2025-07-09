import { reviewModel } from "../model/review.model";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";

const getAllReviews = asyncHandler(async function (req, res) {
  const reviews = await reviewModel.find();
  return res
    .status(200)
    .json(new ApiResponse(200, reviews, "Reviews successfully retrieved"));
});

const createReview = asyncHandler(async function (req, res) {
  const newReview = await Review.create(req.body);
  return res
    .status(201)
    .json(new ApiResponse(201, newReview, "New Review Created"));
});

export const reviewController = { getAllReviews, createReview };
