const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helment = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');

const AppError = require('./helpers/appError');
const errorController = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');

const app = express();

// Middlewares start here
//
var whitelist = ['http://localhost:3000', 'http://localhost:8000'];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

app.use(cors());

// set Security HTTP headers
app.use(helment());

// get server logs for development
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// set limit request from the same API/IP
const limiter = rateLimit({
  max: 100,

  // 1 hour in miliseconds
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP. Please try again in an hour.',
});

app.use('/api', limiter);

// built in middlware - reads data from body into req.body
app.use(
  express.json({
    // limit response body size
    limit: '10kb',
  })
);

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization again XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

// Serve static files
app.use(express.static(`${__dirname}/public`));

// mount the routers
//
// for /api/v1/tours route, apply routetourRouter middleware
app.use('/api/v1/tours', tourRouter);

// for /api/v1/users route, apply userRouter middleware
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

// unhandled routes
app.all('*', (req, res, next) => {
  // If next function receives an argument, then express assumes there was an error
  // even if there are middlewares between this and the error middleware handler
  // it skips all the in-between middlwares
  next(new AppError(`Can't find ${req.originalUrl} on this server.`, 404));
});

// In Express, error handling middleware are middleware functions that accept four arguments
app.use(errorController);
//
// Middlewares end here

module.exports = app;
