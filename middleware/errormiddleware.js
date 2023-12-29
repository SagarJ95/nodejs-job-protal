const errorMiddleware = (err, req, res, next) => {
  const defaultErrors = {
    statusCode: 500,
    message: err,
  };

  // Handle MongoDB duplicate key error
  if (err.name === "MongoServerError" && err.code === 11000) {
    defaultErrors.statusCode = 400;
    defaultErrors.message = `${
      Object.keys(err.keyPattern)[0]
    } field has to be unique`;
  }

  //missing fields error
  if (err.name === "ValidationError") {
    defaultErrors.statusCode = 400;
    defaultErrors.message = Object.values(err.errors)
      .map((item) => item.message)
      .join(",");
  }

  res.status(defaultErrors.statusCode).json({ message: defaultErrors.message });
};

module.exports = errorMiddleware;
