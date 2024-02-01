import { Tour } from "../model/tour.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiFeatures } from "../utils/ApiFeatures.js";
const getAllTours = async (req, res) => {
  try {
    // 1) filtering the data
    // const queryObj = { ...req.query };
    // const excludeFields = ["page", "sort", "limit", "fields"];
    // excludeFields.forEach((el) => delete queryObj[el]);
    // let queryStr = JSON.stringify(queryObj);
    // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    // let query = Tour.find(JSON.parse(queryStr));
    // 2) sorting the data
    // if (req.query.sort) {
    //   const sortBy = req.query.sort.split(",").join(" ");
    //   console.log(sortBy);
    //   query = query.sort(sortBy);
    // } else {
    //   query = query.sort("-createdAt");
    // }
    // 3) limiting fields
    // if (req.query.fields) {
    //   const fields = req.query.fields.split(",").join(" ");
    //   query = query.select(fields);
    // } else {
    //   query = query.select("-__v");
    // }
    // 4) pagination
    // page=2&limit=10 , 1-10, page 1, 11-20 , page 2 21-30 and so on
    // const _page = req.query.page * 1 || 1;
    // const _limit = req.query.limit * 1 || 100;
    // const _skip = (_page - 1) * _limit;
    // query = query.skip(_skip).limit(_limit);
    // if (req.query.page) {
    //   const numberOfTours = await Tour.countDocuments();
    //   if (_skip >= numberOfTours) {
    //     throw new ApiError(400, "This page does not exists");
    //   }
    // }
    // calling our api feature class
    const features = new ApiFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const tours = await features.query;
    if (tours.length === 0) {
      throw new ApiError(400, "No tours found");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, tours, "Tours found successfully"));
  } catch (error) {
    // return res
    //   .status(400)
    //   .json(new ApiError(400, error?.message || "Bad Request"));
    throw new ApiError(400, error?.message || "Bad Request");
  }
};

const getParticularUser = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour) {
      throw new ApiError(404, "Tour not found");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, tour, "Tour found successfully"));
  } catch (error) {
    throw new ApiError(400, error?.message || "Bad Request");
  }
};

const createTour = async (req, res) => {
  try {
    if (!req.body) {
      throw new ApiError(400, "Invalid Request: Missing request body");
    }
    const newTour = await Tour.create(req.body);
    return res
      .status(200)
      .json(new ApiResponse(200, newTour, "Tour created successfully"));
  } catch (error) {
    throw new ApiError(400, error?.message || "Invalid Request");
  }
};

const deleteTour = async (req, res) => {
  try {
    if (!req.params.id) {
      throw new ApiError(400, "Invalid Request: Missing tour ID");
    }
    const deletedTour = await Tour.findByIdAndDelete(req.params.id);
    if (!deletedTour) {
      throw new ApiError(404, "Tour not found");
    }
    return res
      .status(204)
      .json(new ApiResponse(204, deletedTour, "Tour deleted successfully"));
  } catch (error) {
    throw new ApiError(400, error?.message || "Invalid Bad request");
  }
};

const updateTour = async (req, res) => {
  try {
    if (!req.params.id) {
      throw new ApiError(400, "Invalid Request: Missing tour ID");
    }
    const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedTour) {
      throw new ApiError(404, "Tour not found");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, updatedTour, "Tour updated successfully"));
  } catch (error) {
    throw new ApiError(400, error?.message || "Invalid Bad Request");
  }
};

export { getAllTours, getParticularUser, createTour, deleteTour, updateTour };
