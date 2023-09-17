export const successMessage = (res, code, message) => {
  return res.status(code).json({
    success: true,
    ...message,
  });
};
