const mongoose = require('mongoose');
const slugify = require('slugify');
const User = require('./userModel');

const tourSchema = new mongoose.Schema(
  {
    slug: String,
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxLength: [40, 'A tour name must be less or equal to 40 characters'],
      minLength: [10, 'A tour name must be more or equal to 10 characters'],
    },
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either "easy", "medium" or "difficult".',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above or equal to 1.0'],
      max: [5, 'Rating must be below or equal to 5.0'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // this only points to current doc on NEW document creation
          // it doesn't work on update.
          return val < this.price;
        },
        message: 'Discount price should be below regular price.',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a summary'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },

    // Geospatial data
    startLocation: {
      // GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        // GeoJSON
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    // Embedding guides
    guides: Array,
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

tourSchema.virtual('durationWeeks').get(function () {
  return +(this.duration / 7).toFixed(2);
});

/** Pre validation starts here */
// DOCUMENT MIDDLWARE: runs only before .save() and .create()
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

tourSchema.pre('save', async function (next) {
  const guidesPromises = this.guides.map(async (id) => await User.findById(id));
  this.guides = await Promise.all(guidesPromises);
  next();
});

// tourSchema.pre('save', (next) => {
//   next();
// });

// post middleware are executed after the hooked method and all of its pre middleware have completed.Thus, no access to this
// tourSchema.post('save', (doc, next) => {
//   next();
// });

// QUERY MIDDLEWARE:

// if we only use find, then this will not work for findOne and so on
// so use Regex to find all the query that starts with find.
tourSchema.pre(/^find/, function (next) {
  // this here now is a query object
  this.find({ secretTour: { $ne: true } });

  this.start = Date.now();
  next();
});

// AGGREGATION MIDDLEWARE
// we could have added the match to filter out in each route
// but its better to handle through middleware
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({
    $match: { secretTour: { $ne: true } },
  });
  next();
});

/** Pre validation ends here */

tourSchema.post(/^find/, function (docs, next) {
  // find out the time it took to get the data
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);

  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
