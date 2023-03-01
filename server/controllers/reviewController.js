const Review = require('../models/reviewModel');
const catchAsyncError = require('../helpers/catchAsyncError');
const AppError = require('../helpers/appError');

exports.getAllReviews = catchAsyncError(async (req, res, next) => {
  const reviews = await Review.find().select('-__v');

  res.status(200).json({
    status: 'success',
    result: reviews.length,
    data: {
      reviews,
    },
  });
});

exports.createReview = catchAsyncError(async (req, res, next) => {
  const { review, rating, user, tour } = req.body;

  if (!review || !rating > 0 || !user || !tour)
    return next(
      new AppError('You must enter review rating user and tour', 400)
    );

  const newReview = await Review.create({
    review,
    rating,
    user,
    tour,
  });

  res.status(201).json({
    status: 'success',
    data: {
      review: newReview,
    },
  });
});

exports.deleteReview = catchAsyncError(async (req, res, next) => {
  const deleteReview = req.params.id;
  await Review.findByIdAndDelete(deleteReview);

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
