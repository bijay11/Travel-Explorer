const User = require('../models/userModel');
const catchAsyncError = require('../helpers/catchAsyncError');

exports.signup = catchAsyncError(async (req, res, next) => {
  // just filter what is required to signIn from req.body
  const { name, email, password, passwordConfirm } = req.body;
  const newUser = await User.create({ name, email, password, passwordConfirm });

  res.status(201).json({
    status: 'success',
    data: {
      user: newUser,
    },
  });
});
