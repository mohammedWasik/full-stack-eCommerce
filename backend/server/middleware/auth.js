import User from "../database/models/userModel.js";
import { ErrorHandler } from "../utils/errorHandler.js";
import catchAsyncError from "./catchAsyncError.js";
import jwt from "jsonwebtoken";

/* -------------------------------------------------------------------------- */
//*                             check if logged in                             */
/* -------------------------------------------------------------------------- */
export const isAuthenticated = catchAsyncError(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(ErrorHandler("Please Login to access this resource", 401));
  }

  const decodedData = jwt.verify(token, process.env.JWT_SECRET);

  req.user = await User.findById(decodedData.id);

  next();
});

/* -------------------------------------------------------------------------- */
//*                         check roles for permission                         */
/* -------------------------------------------------------------------------- */
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      next(
        ErrorHandler(
          `Role : ${req.user.role} is not allowed to access this resource `,
          403
        )
      );
    }

    next();
  };
};
