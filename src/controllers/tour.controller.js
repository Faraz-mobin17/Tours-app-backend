import { Tour } from "../model/tour.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiFeatures } from "../utils/ApiFeatures.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const aliasTopTours = asyncHandler(async (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingAverage,difficulty";
  next();
});

const getAllTours = asyncHandler(async (req, res) => {
  const features = new ApiFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const tours = await features.query;
  if (tours.length === 0) {
    return res.status(400).json(new ApiResponse(400, [], "No tours found"));
  }
  return res
    .status(200)
    .json(new ApiResponse(200, tours, "Tours found successfully"));
});

const getTour = asyncHandler(async (req, res) => {
  const tour = await Tour.findById(req.params.id).populate("reviews");
  if (!tour) {
    return res.status(404).json(new ApiError(404, "Tour not found"));
  }
  return res
    .status(200)
    .json(new ApiResponse(200, tour, "Tour found successfully"));
});

const createTour = asyncHandler(async (req, res) => {
  if (!req.body) {
    return res
      .status(400)
      .json(new ApiError(400, "Invalid Request: Missing request body"));
  }
  const newTour = await Tour.create(req.body);
  return res
    .status(200)
    .json(new ApiResponse(200, newTour, "Tour created successfully"));
});

const deleteTour = asyncHandler(async (req, res) => {
  if (!req.params.id) {
    return res
      .status(400)
      .json(new ApiError(400, "Invalid Request: Missing tour ID"));
  }
  await Tour.findByIdAndDelete(req.params.id);
  return res
    .status(204)
    .json(new ApiResponse(204, null, "Tour deleted successfully"));
});

const updateTour = asyncHandler(async (req, res) => {
  if (!req.params.id) {
    return res
      .status(400)
      .json(new ApiError(400, "Invalid Request: Missing tour ID"));
  }

  const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!updatedTour) {
    return res.status(404).json(new ApiError(404, "Tour not found"));
  }
  return res
    .status(200)
    .json(new ApiResponse(200, updatedTour, "Tour updated successfully"));
});

const getTourStats = asyncHandler(async (_, res) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: "$difficulty" },
        numberOfTour: { $sum: 1 },
        numOfRatings: { $sum: "$ratingsQuantity" },
        avgRating: { $avg: "$ratingsAverage" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
  ]);
  return res
    .status(200)
    .json(new ApiResponse(200, stats, "Data Fetched Successfully"));
});

const getMonthlyPlan = asyncHandler(async (req, res) => {
  const year = req.params.year * 1 || 1;
  const plan = await Tour.aggregate([
    {
      $unwind: "$startDates",
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: "$startDates" },
        numberOfToursStarts: { $add: 1 },
        tours: { $push: "$name" },
      },
    },
    {
      $addFields: { month: "$_id" },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { numberOfToursStarts: -1 },
    },
    {
      $limit: 12,
    },
  ]);
  return res
    .status(200)
    .json(new ApiResponse(200, plan, "Success received monthly plan"));
});

export {
  getAllTours,
  getTour,
  createTour,
  deleteTour,
  updateTour,
  getTourStats,
  getMonthlyPlan,
  aliasTopTours,
};
