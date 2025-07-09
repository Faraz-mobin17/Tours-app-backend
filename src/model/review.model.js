import mongoose, { Schema } from "mongoose";
const reviewSchema = new Schema({
  review: {
    type: String,
  },
  ratings: {
    type: Number,
    min: 1,
    max: 5,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  tour: {
    type: mongoose.Types.ObjectId,
    ref: "Tour",
    required: [true, "Tour should exists for reviewsSchema"],
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: [true, "User must exists for review Schema"],
  },
});

export const reviewModel = mongoose.model("Review", reviewSchema);
