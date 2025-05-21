import { User } from "../model/user.modal";
import { asyncHandler } from "../middleware/asyncHandler";
import { ApiError } from "../utils/apiError";
import jwt from "jsonwebtoken";

const signupToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

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

  const token = signupToken(user._id);

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
  const token = signupToken(user._id);

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

const protect = asyncHandler(async (req, res, next) => {
  // check if token is provided
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new ApiError(401, "You are not logged in! Please log in"));
  }

  // verify token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new ApiError(401, "The user belonging to this token does no longer exist")
    );
  }

  // check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new ApiError(401, "User recently changed password! Please log in again")
    );
  }

  // grant access to protected route
  req.user = currentUser;
  next();
});

export { signup, login, protect };
