import { ErrorHandler } from "../utils/index.js";

export const error = (err, req, res, next) => {
  err.statusCode = err.statuscode || 500;
  err.message = err.message || "Internal Server Error";

  /* ------------------------ wrong mongodb id error ------------------------ */
  if (err.name === "CastError") {
    const message = `ID is wrong. Invalid ${err.path}`;
    err = ErrorHandler(message, 400);
  }

  /* ---------------------- mongoose duplicate key error ---------------------- */
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
    err = ErrorHandler(message, 400);
  }

  /* ------------------------ wrong jwt error ------------------------ */
  if (err.name === "JsonWebTokenError") {
    const message = `JWT is is invalid , try again`;
    err = ErrorHandler(message, 400);
  }
  /* ------------------------ wrong jwt error ------------------------ */
  if (err.name === "TokenExpired Error") {
    const message = `JWT is expired, try again`;
    err = ErrorHandler(message, 400);
  }

  /* ------------------------------ Error message ----------------------------- */
  res.status(err.statusCode).json({
    success: false,
    code: err.statusCode,
    message: err.message,
  });
};
