export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "An unexpected error occurred",
    error: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};
