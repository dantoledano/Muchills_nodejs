/* eslint-disable node/no-unsupported-features/es-syntax */
const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateErrorDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value ${value}. Please use another value instead`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data: ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () => {
  const message = 'Invalid token. Please log in again.';
  return new AppError(message, 401);
};

const handleJWTExpiredError = () => {
  const message = 'Token expired. Please log in again.';
  return new AppError(message, 401);
};
const sendErrorDev = (err, req, res) => {
  // API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }

  //Rendered website
  console.error('Error: ', err);

  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong :(',
    msg: err.message,
  });
};

const sendErrorProd = (err, req, res) => {
  // API
  if (req.originalUrl.startsWith('/api')) {
    //operational error
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    //programming or unknown error
    //1) log the error
    console.error('Error: ', err);
    //2) send a generic error
    return res
      .status(500)
      .json({ status: 'error', message: 'somnthing went wrong' });
  }

  //Rendered website
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong :(',
      msg: err.message,
    });
  }
  //programming or unknown error
  //1) log the error
  console.error('Error: ', err);
  //2) send a generic error
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong :(',
    msg: 'Please try again later.',
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    // let error;
    // if (err.name === 'CastError') error = handleCastErrorDB(err);
    // if (err.code === 11000) error = handleDuplicateErrorDB(err);
    // if (err._message === 'Validation failed')
    //   error = handleValidationErrorDB(err);
    // if (err.name === 'JsonWebTokenError') error = handleJWTErrorDB(err);
    let error = { ...err };

    // When we deconstruct our "err" object we have not "message" property in "error"
    // but i don't know that why we are not getting message property on "error" from above
    //line of code

    error.message = err.message; // i just add this line of code in errorController.js

    if (error.name === 'CastError') {
      error = handleCastErrorDB(error);
    }
    if (error.code === 11000) {
      error = handleDuplicateErrorDB(error);
    }
    if (error.name === 'ValidationError') {
      error = handleValidationErrorDB(error);
    }
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();
    sendErrorProd(error, req, res);
  }
};
