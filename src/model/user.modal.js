import mongoose, { Schema } from "mongoose";
import validator from "validator";
import crypto from "node:crypto";

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please enter a valid email"],
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"],
    select: false, // Do not return password by default
  },
  passwordConfirm: {
    type: String,
    required: [true, "Password confirmation is required"],
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords do not match",
    },
  },
  photo: {
    type: String,
  },
  role: {
    type: String,
    enum: ["user", "admin", "guide", "lead-guide"],
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre("save", async function (next) {
  // Hash password if it has been modified (or is new)
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined; // Remove passwordConfirm field
  next();
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function (next) {
  // this points to current query
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  // we cannot use this.password here because it is not available
  // this.password is not available because it is not in the document
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    console.log(changedTimestamp, JWTTimestamp);
    return JWTTimestamp < changedTimestamp;
  }
  return false; // user has not changed password after the token was issued
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken; // plaintext token that will be send to email
};

export const User = mongoose.model("User", userSchema);
