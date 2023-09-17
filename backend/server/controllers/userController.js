import catchAsyncError from "../middleware/catchAsyncError.js";
import { ErrorHandler } from "../utils/errorHandler.js";
import User from "../database/models/userModel.js";
import { sendToken } from "../utils/jwtToken.js";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto";
import cloudinary from "cloudinary";
import fileUpload from "express-fileupload";

/* -------------------------------------------------------------------------- */
//*                                register user                               */
/* -------------------------------------------------------------------------- */
export const registerUser = catchAsyncError(async (req, res, next) => {
  const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
    folder: "avatars",
    width: 150,
    crop: "scale",
    public_id: `${Date.now()}`,
  });

  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: myCloud.public_id,
      url_id: myCloud.secure_url,
    },
  });
  sendToken(user, 201, res);
});

/* -------------------------------------------------------------------------- */
//*                                    login                                   */
/* -------------------------------------------------------------------------- */
export const login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  //must have both email and pass

  if (!email || !password) {
    return next(ErrorHandler("Please enter valid email and password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(ErrorHandler("Invalid email or password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(ErrorHandler("Invalid email or password", 401));
  }

  sendToken(user, 200, res);
});

/* -------------------------------------------------------------------------- */
//*                               logout function                              */
/* -------------------------------------------------------------------------- */
export const logout = catchAsyncError(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

/* -------------------------------------------------------------------------- */
//*                       Forgot password and  send email                      */
/* -------------------------------------------------------------------------- */
export const forgetPassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(ErrorHandler("user not found", 404));
  }

  const resetToken = await user.getResetPassToken();
  await user.save({ validateBeforeSave: false });

  const resetPasswordURL = `${process.env.FRONTENDHOST}/password/reset/${resetToken}`;

  const message = `Your password reset url is : \n\n ${resetPasswordURL} \n\n If you have not requested a password reset please ignore this `;

  try {
    await sendEmail({
      email: user.email,
      subject: "eCommerce Password Recovery",
      message,
    });
    res.status(200).json({
      success: true,
      message: `email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(ErrorHandler(error.message, 500));
  }
});

/* -------------------------------------------------------------------------- */
//*                               Reset password                               */
/* -------------------------------------------------------------------------- */
export const resetPassword = catchAsyncError(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      ErrorHandler("Reset Password Token is invalid or has been expired", 400)
    );
  }
  if (req.body.password !== req.body.confirmPassword) {
    return next(ErrorHandler("Password Doesnt match", 400));
  }
  user.password = req.body.password;
  user.resetPasswordExpire = undefined;
  user.resetPasswordToken = undefined;

  await user.save();
  sendToken(user, 200, res);
});

/* -------------------------------------------------------------------------- */
//*                               Get User Detail                              */
/* -------------------------------------------------------------------------- */
export const getUserDetail = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

/* -------------------------------------------------------------------------- */
//*                            Update user Password                            */
/* -------------------------------------------------------------------------- */

export const updatePassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(ErrorHandler("Wrong Old password", 401));
  }
  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(ErrorHandler("Password Doesnt match", 400));
  }

  user.password = req.body.newPassword;
  await user.save();

  sendToken(user, 200, res);
});

/* -------------------------------------------------------------------------- */
//*                             Update User Profile                            */
/* -------------------------------------------------------------------------- */

export const updateProfile = catchAsyncError(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  if (req.body.avatar !== "") {
    const user = await User.findById(req.user.id);
    const imageId = user.avatar.public_id;
    await cloudinary.v2.uploader.destroy(imageId);

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "avatars",
      width: 150,
      crop: "scale",
    });
    newUserData.avatar = {
      public_id: myCloud.public_id,
      url_id: myCloud.secure_url,
    };
  }

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidator: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

/* -------------------------------------------------------------------------- */
//*                                get all users - admin                      */
/* -------------------------------------------------------------------------- */

export const getAllUser = catchAsyncError(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    success: true,
    users,
  });
});

/* ----------------------------------------------------------------------- --- */
//*                            Get single user admin                           */
/* -------------------------------------------------------------------------- */

export const getSingleUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(ErrorHandler(`User does not exist ID ${req.params.id} `));
  }

  res.status(200).json({
    success: true,
    user,
  });
});

/* -------------------------------------------------------------------------- */
//*                             update role --Admin                            */
/* -------------------------------------------------------------------------- */

export const updateProfileRole = catchAsyncError(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidator: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    user,
  });
});

/* -------------------------------------------------------------------------- */
//*                           Delete profile --admin                           */
/* -------------------------------------------------------------------------- */

export const deleteUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(ErrorHandler(`user doesn't exist with id ${req.params.id}`));
  }

  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: "user deleted sucessfully",
  });
});
