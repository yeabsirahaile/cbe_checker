module.exports = (res, error, code = 500) => {
  console.error(error);
  res.status(code).json({
    success: false,
    message: error.message || "Internal Server Error",
  });
};
