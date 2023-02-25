const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsyncError = require('../helpers/catchAsyncError');

exports.signup = catchAsyncError(async (req, res, next) => {
  // just filter what is required to signIn from req.body
  const { name, email, password, passwordConfirm } = req.body;
  const newUser = await User.create({ name, email, password, passwordConfirm });

  const { JWT_SECRET, JWT_EXPIRES_IN } = process.env;

  const token = jwt.sign({ id: newUser._id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});
