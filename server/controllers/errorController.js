const AppError = require('../helpers/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = ({ keyValue: { name } }) => {
  const message = `Duplicate field value: "${name}". Please use another value.`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = ({ errors }) => {
  let errorMsgs = Object.values(errors)
    .map((el) => el.message)
    .join('. ');
  const message = `Invlalid input data: ${errorMsgs}`;
  return new AppError(message, 400);
};

const handleJwtError = () =>
  new AppError('Invalid token. Please login again', 401);

const handleJwtExpiredError = () =>
  new AppError('Your token has expired. Please login again', 401);

const sendErrorForDev = (err, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorForProd = (err, res) => {
  // Operational, trusted error
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  // Programming or other unknown error - so do not leak error details..

  // Send Generic error message
  return res.status(500).json({
    status: 'error',
    message: 'Something went wrong!',
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    return sendErrorForDev(err, res);
  }

  // change mongoDB error to operations if the error name is castError.
  let error = JSON.stringify(err);
  error = JSON.parse(error);

  if (error.name === 'CastError') error = handleCastErrorDB(error);
  if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
  if (error.name === 'JsonWebTokenError') error = handleJwtError();
  if (error.name === 'TokenExpiredError') error = handleJwtExpiredError();
  if (error.code === 11000) error = handleDuplicateFieldsDB(error);

  return sendErrorForProd(error, res);
};
