const mongoose = require('mongoose');
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

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
