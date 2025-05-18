import { User } from "../model/user.modal";
import { asyncHandler } from "../middleware/asyncHandler";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/ApiResponse";
const signup = asyncHandler(async (req, res, next) => {
  const { name, email, password, passwordConfirm } = req.body;
  // check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return next(new ApiError("User already exists", 400));
  }
  // create user
  const user = await User.create({
    name,
    email,
    password,
    passwordConfirm,
  });
  // send response
  res.status(201).json(new ApiResponse(201, user, "User created successfully"));
});

export { signup };
