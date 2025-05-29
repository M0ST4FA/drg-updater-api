class AppError {
  constructor(message, code) {
    this.message = message;
    this.code = code;

    if (code < 500)
      // Code is between 400-499
      this.status = 'fail';
    else this.status = 'error'; // Code is between 500-599

    // `code` will not be in any other range
  }
}

function catchAsync(fn) {
  return async function (req, res, next) {
    try {
      await fn(req, res, next);
    } catch (error) {
      return next(new AppError(error.message, error.code));
    }
  };
}

export { AppError, catchAsync };
