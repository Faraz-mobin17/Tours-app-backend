import { User } from "../model/user.modal.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

const getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find();

  // send response
  return res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
});

const updateMe = asyncHandler(async (req, res, next) => {
  // 1) create error if user POST passwords data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new ApiError(
        400,
        "This route is not for password update. please you /updateMyPassword"
      )
    );
  }
  //   2) filterd out unwanted things
  const filteredBody = filterObj(req.body, "name", "email");
  // 3) update user document
  const updateUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true, // return the new object
    runValidators: true,
  });
  return res
    .status(200)
    .json({ status: "success", data: { user: updateUser } });
});

const deleteMe = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  return res.status(204).json({
    status: "success",
    data: null,
  });
});

export { getAllUsers, updateMe, deleteMe };
