const User = require('../models/userModel');
const catchAsyncError = require('../helpers/catchAsyncError');
const AppError = require('../helpers/appError');
const factory = require('./handlerFactory');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};

exports.checkID = (req, res, next, val) => {
  // placeholder for the validation
  next();
};

exports.updateMe = catchAsyncError(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('You cannot update password here.', 400));
  }

  // filter out what is required from req.body
  // so that the user won't be able to pass unwanted values in DB
  const filteredBody = filterObj(req.body, 'name', 'email');

  // findById will end up using save method and it will trigger password validation as well
  // so use findByIdAndUpdate for insenstive data
  const updatedUser = await User.findByIdAndUpdate(req.user._id, filteredBody, {
    new: true,
    runValidators: true,
  });

  // Update user document
  res.status(200).json({
    status: 'success',
    data: {
      updatedUser,
    },
  });
});

exports.deleteMe = catchAsyncError(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { activeUser: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
