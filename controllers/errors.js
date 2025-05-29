function errorHandler(err, req, res, next) {
  console.log(err);

  res.status(err.code).json({
    status: err.status,
    message: err.message,
  });
}

export default errorHandler;
