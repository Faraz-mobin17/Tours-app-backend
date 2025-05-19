import { User } from "../model/user.modal";
import { asyncHandler } from "../middleware/asyncHandler";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/ApiResponse";
import jwt from "jsonwebtoken";

const signup = asyncHandler(async (req, res, next) => {
  const { name, email, password, passwordConfirm } = req.body;
  // check if user already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    return next(new ApiError(400, "User already exists"));
  }

  // create user
  const user = await User.create({
    name,
    email,
    password,
    passwordConfirm,
  });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  // send response
  return res.status(201).json({
    status: "success",
    token,
    message: "User created successfully",
    data: {
      user,
    },
  });
});

const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // check if email and password are provided
  if (!email || !password) {
    return next(new ApiError(400, "Please provide email and password"));
  }

  // check if user exists
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new ApiError(401, "Incorrect email or password"));
  }

  // generate token
  const token = undefined;

  // send response
  return res.status(200).json({
    status: "success",
    token,
    message: "User logged in successfully",
    data: {
      user,
    },
  });
});

export { signup, login };
