const Review = require('../models/reviewModel');
const catchAsyncError = require('../helpers/catchAsyncError');
const AppError = require('../helpers/appError');

exports.getAllReviews = catchAsyncError(async (req, res, next) => {
  let filter = {};
  let tour = req.params.tourId;
  if (tour) filter = { tour };
  const reviews = await Review.find(filter).select('-__v');

  res.status(200).json({
    status: 'success',
    result: reviews.length,
    data: {
      reviews,
    },
  });
});

exports.createReview = catchAsyncError(async (req, res, next) => {
  let { review, rating, user, tour } = req.body;

  // get these values from middlewares
  if (!tour) tour = req.params.tourId;
  if (!user) user = req.user._id;

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
