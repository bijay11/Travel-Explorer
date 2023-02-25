const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsyncError = require('../helpers/catchAsyncError');
const AppError = require('../helpers/appError');

const { JWT_SECRET, JWT_EXPIRES_IN } = process.env;

const signToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

exports.signup = catchAsyncError(async (req, res, next) => {
  // just filter what is required to signIn from req.body
  const { name, email, password, passwordConfirm, passwordChangedAt } =
    req.body;
  const newUser = await User.create({
    name,
    email,
    password,
    passwordConfirm,
    passwordChangedAt,
  });

  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if the email and password are empty
  if (!email || !password)
    return next(new AppError('Please provide email and password!', 400));

  // Check if the user exisits and password is correct
  const user = await User.findOne({ email }).select('+password');

  // since user is now a document, we can use correctPassword defined in userSchema.
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // If everything is fine, send token to the client
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});

exports.protect = catchAsyncError(async (req, res, next) => {
  const { authorization } = req.headers;
  let token;

  // if authorization token exists and it starts with Bearer.
  if (authorization && authorization.startsWith('Bearer ')) {
    [, token] = authorization.split(' ');
  }

  // if token doesn't exist
  if (!token) {
    return next(
      new AppError('You are not logged in! Please login to get access', 401)
    );
  }

  // Verify token
  const decoded = await promisify(jwt.verify)(token, JWT_SECRET);

  // Check if the user still exists
  const currentUser = await User.findById(decoded.id).select('+password');

  if (!currentUser)
    return next(
      new AppError('The user belonging to the token no longer exist', 401)
    );

  // Verify if the user hasn't changed the password
  const isPasswordUnchanged = await currentUser.passwordChangedAfter(
    decoded.iat
  );

  if (isPasswordUnchanged)
    return next(
      new AppError('User recently changed password! Please login again', 401)
    );

  // all checks passed, now grant access to protected route
  req.user = currentUser;
  next();
});
