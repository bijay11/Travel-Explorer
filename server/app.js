const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// Middlewares start here
//
// get server logs
app.use(morgan('dev'));

// built in middlware - parses incoming JSON requests and puts the parsed data in req.body
app.use(express.json());

// mount the routers
//
// for /api/v1/tours route, apply routetourRouter middleware
app.use('/api/v1/tours', tourRouter);

// for /api/v1/users route, apply userRouter middleware
app.use('/api/v1/users', userRouter);
//
// Middlewares end here

// Start Server
const port = 3000;

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
