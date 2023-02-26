const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsyncError = require('../helpers/catchAsyncError');
const AppError = require('../helpers/appError');
const sendEmail = require('../helpers/email');

const { JWT_SECRET, JWT_EXPIRES_IN } = process.env;

const signToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
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

  createSendToken(newUser, 201, res);
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
  createSendToken(user, 200, res);
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

  // all checks passed

  // add the current user to the request object
  req.user = currentUser;

  // now grant access to protected route
  next();
});

exports.restrictTo = (...roles) => {
  // forming a closure so that the middleware can have access to roles.
  return (req, res, next) => {
    // req.user is passed from protect middleware
    // and will have access to roles because of closure.
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }

    next();
  };
};

exports.forgotPassword = catchAsyncError(async (req, res, next) => {
  const { email } = req.body;

  if (!email) return next(new AppError('Email is required', 400));

  const user = await User.findOne({ email });

  if (!user) {
    return next(new AppError('No User found with the email address', 404));
  }

  const resetToken = user.createPasswordResetToken();

  // deactivate all validators from schema
  await user.save({ validateBeforeSave: false });

  // send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a request to get your new password to: ${resetURL}.\nIf you didn't forget your password, please ignore this email.`;
  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to your email',
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpiresOn = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError(
        'There was an error sending the email. Please try again later.',
        500
      )
    );
  }
});

exports.resetPassword = catchAsyncError(async (req, res, next) => {
  // get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpiresOn: { $gt: Date.now() },
  });

  // if no user, that means either reset token is expired or the user doesn't exist
  if (!user) return next(new AppError('Token has expired or is invalid', 404));

  // user is found and the token is valid !!
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;

  // delete the token and the expire date
  user.passwordResetToken = undefined;
  user.passwordResetExpiresOn = undefined;

  await user.save();

  // Log the user in, send JWT
  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsyncError(async (req, res, next) => {
  // get user from the collection

  const user = await User.findById(req.user.id).select('+password');

  if (!user) return next(new AppError('User not found', 404));

  // check if posted current password is correct
  const currentPassword = req.body.passwordCurrent;
  const newPassword = req.body.password;
  const confirmNewPassword = req.body.passwordConfirm;

  if (!currentPassword || !newPassword || !confirmNewPassword)
    return next(new AppError('Password provide old and new password', 400));

  //if it is correct, update password
  const isPasswordMatch = await user.correctPassword(
    currentPassword,
    user.password
  );

  if (!isPasswordMatch)
    return next(new AppError('Your password is incorrect', 401));

  // at this point, user is validated, password also matched.
  // update the password to new password and save
  user.password = newPassword;
  user.passwordConfirm = confirmNewPassword;
  await user.save();

  // Log the user in, send JWT
  createSendToken(user, 200, res);
});
