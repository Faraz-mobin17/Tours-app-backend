import { Tour } from "../model/tour.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getAllTours = async (_, res) => {
  try {
    const tours = await Tour.find();
    if (tours.length === 0) {
      throw new ApiError(400, "No tours found");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, tours, "Tours found successfully"));
  } catch (error) {
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
