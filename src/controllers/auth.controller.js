import crypto from "node:crypto";
import { User } from "../model/user.modal";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/email";

const signupToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const singupTokenWithResponse = (user) => {
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
  // const token = signupToken(user._id);

  // // send response
  // return res.status(200).json({
  //   status: "success",
  //   token,
  //   message: "User logged in successfully",
  //   data: {
  //     user,
  //   },
  // });
  return singupTokenWithResponse(user);
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
  const decoded = await jwt.verify(token, process.env.JWT_SECRET);

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

const restrict = (...roles) => {
  // dealing with user roles
  return (req, res, next) => {
    // roles ['admin', 'lead-guide', 'user'].role = 'user'
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(403, "You don't have permission to perform this action")
      );
    }
    next();
  };
};

const forgotPassword = asyncHandler(async (req, res, next) => {
  // get user based on email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiError(404, "There is no user with this email address"));
  }
  // generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await resetToken.save({ validateBeforeSave: false }); // deactivate all the validators in schema

  // create reset url
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/auth/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;
  try {
    // send email
    await sendEmail({
      email: user.email,
      subject: "Your password reset token (valid for 10 min)",
      message,
    });

    return res.status(200).json({
      status: "success",
      message: "Token sent to email!",
    });
  } catch (err) {
    // if error occurs, reset the password reset token and expiration
    user.createPasswordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new ApiError(500, "There was an error sending the email"));
  }
});

const resetPassword = asyncHandler(async (req, res, next) => {
  // reset password func
  // 1) get user based on the token
  const { token } = req.params;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  // 2) if token has not expired, set the new password
  if (!user) {
    return next(new ApiError(404, "User not found"));
  }

  // 3) update changedPasswordAt property for the user

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save(); // we want the validators to check passwords
  // 4) log the user in, send JWT
  return singupTokenWithResponse(user);
});

const updatePassword = asyncHandler(async (req, res, next) => {
  // 1) get the user from the collection
  const user = await User.findById(req.user.id).select("+password"); // not included in the output so we are using select('+password) here
  // 2) check if posted current password is current
  if (!(await user.correctPassword(req.body.passwordConfirm, user.password))) {
    return next(new ApiError(401, "Your current password is wrong"));
  }
  // 3) if so, update the password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save(); // we need validators so we are not turning it off
  // 4) login user and send JWT
  return singupTokenWithResponse(user);
});

export {
  signup,
  login,
  protect,
  restrict,
  forgotPassword,
  resetPassword,
  updatePassword,
};
