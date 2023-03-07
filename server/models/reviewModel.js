const mongoose = require('mongoose');
const Tour = require('./tourModel');
const AppError = require('../helpers/appError');

// review // rating / createdAt / ref to tour / ref to user

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review cannot be empty'],
      trim: true,
      maxLength: [1000, 'A review name must be less or equal to 40 characters'],
      minLength: [10, 'A review name must be more or equal to 10 characters'],
    },
    rating: {
      type: Number,
      min: [1, 'Rating must be above or equal to 1.0'],
      max: [5, 'Rating must be below or equal to 5.0'],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },

    // Parent referencing.
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
  },
  // virtual properties that is not stored in DB but is calculated for some purpose.
  // show in the output.
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

reviewSchema.pre(/^find/, function (next) {
  // runs queries for userbehind the scene.
  this.populate({
    path: 'user',
    select: 'name photo',
  });

  next();
});

// used statics method aggregate method on model
reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    { $match: { tour: tourId } },

    // group by the tour
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  if (stats.length) {
    const [{ nRating, avgRating }] = stats;

    return await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: nRating,
      ratingsAverage: avgRating,
    });
  }

  await Tour.findByIdAndUpdate(tourId, {
    ratingsQuantity: 0,
    ratingsAverage: 4.5,
  });
};

// use post to calculate the average
// the above calcAverageRatings will be used here
reviewSchema.post('save', function () {
  // We cannot use Review.calcAverageRatings since Review is decalred beneath this
  // if we move this pre after Review is declared then this middleware will not run
  //
  // use constructor instead,
  // it is the model who created the document.
  this.constructor.calcAverageRatings(this.tour);

  // no next call since its a post "save" middleware
  // next();
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.tourReview = await this.clone().findOne();

  if (!this.tourReview)
    return next(new AppError('No document found with provided ID', 404));
});

reviewSchema.post(/^findOneAnd/, async function () {
  //  await this.findOne() doesnt work since the query is already executed on post.

  await this.tourReview.constructor.calcAverageRatings(this.tourReview.tour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
