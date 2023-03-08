const Tour = require('../models/tourModel');
const catchAsyncError = require('../helpers/catchAsyncError');
const factory = require('./handlerFactory');
const AppError = require('../helpers/appError');

exports.aliasTopTours = async (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTours = factory.getAll(Tour);
exports.getTour = factory.getOne(Tour, { path: 'reviews' });
exports.createTour = factory.createOne(Tour);
exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);

exports.getTourStats = catchAsyncError(async (req, res, next) => {
  const stats = await Tour.aggregate([
    { $match: { ratingsAverage: { $gte: 2 } } },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
    // Filter out from above if required.
    // {
    //   $match: { _id: { $ne: 'EASY' } },
    // },
  ]);
  res.status(200).json({
    status: 'success',
    results: stats.length,
    data: { stats },
  });
});

exports.getMonthyPlan = catchAsyncError(async (req, res, next) => {
  const year = +req.params.year;

  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: {
        month: '$_id',
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: {
        numTourStarts: -1,
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    results: plan.length,
    data: { plan },
  });
});

exports.getToursWithin = catchAsyncError(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lattitude, longitude] = latlng.split(',');

  if (!lattitude || !longitude) {
    next(new AppError('Please provide lattitude and longitude.', 404));
  }

  const earthRadiusInMiles = 3963.2;
  const earthRadiusInKm = 6378.1;
  const radianInMiles = distance / earthRadiusInMiles;
  const radianInKm = distance / earthRadiusInKm;

  const radius = unit === 'mi' ? radianInMiles : radianInKm;

  const tours = await Tour.find({
    startLocation: {
      $geoWithin: { $centerSphere: [[longitude, lattitude], radius] },
    },
  });

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: { tours },
  });
});

exports.getDistance = catchAsyncError(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lattitude, longitude] = latlng.split(',');

  if (!lattitude || !longitude) {
    next(new AppError('Please provide lattitude and longitude.', 404));
  }
  const radiansToKm = 0.001;
  const radiansToMiles = 0.000621371;

  const distanceMultiplier = unit === 'mi' ? radiansToMiles : radiansToKm;

  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [+lattitude, +longitude],
        },
        distanceField: 'distance',
        distanceMultiplier,
      },
    },
    {
      $project: {
        distance: 1,
        name: 1,
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    // results: distances.length,
    data: { distances },
  });
});
