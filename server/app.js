const express = require('express');
const morgan = require('morgan');

const AppError = require('./helpers/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// Middlewares start here
//
// get server logs
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// built in middlware - parses incoming JSON requests and puts the parsed data in req.body
app.use(express.json());

// mount the routers
//
// for /api/v1/tours route, apply routetourRouter middleware
app.use('/api/v1/tours', tourRouter);

// for /api/v1/users route, apply userRouter middleware
app.use('/api/v1/users', userRouter);

// unhandled routes
app.all('*', (req, res, next) => {
  // If next function receives an argument, then express assumes there was an error
  // even if there are middlewares between this and the error middleware handler
  // it skips all the in-between middlwares
  next(new AppError(`Can't find ${req.originalUrl} on this server.`, 404));
});

// In Express, error handling middleware are middleware functions that accept four arguments
app.use(globalErrorHandler);
//
// Middlewares end here

module.exports = app;
