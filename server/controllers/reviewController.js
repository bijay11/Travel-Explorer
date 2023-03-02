const Review = require('../models/reviewModel');
const catchAsyncError = require('../helpers/catchAsyncError');
const factory = require('./handlerFactory');

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

exports.setTourUserIds = (req, res, next) => {
  // Allow nested routes

  let { tour, user } = req.body;
  if (!tour) req.body.tour = req.params.tourId;
  if (!user) req.body.user = req.user._id;

  next();
};

exports.createReview = factory.createOne(Review);

exports.updateReview = factory.updateOne(Review);

exports.deleteReview = factory.deleteOne(Review);
