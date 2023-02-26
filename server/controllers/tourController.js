const Tour = require('../models/tourModel');
const apiFilters = require('../helpers/apiFeatures');
const catchAsyncError = require('../helpers/catchAsyncError');
const AppError = require('../helpers/appError');

exports.aliasTopTours = async (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTours = catchAsyncError(async (req, res, next) => {
  // Filter the Query
  const { filter, sortData, paginateData, limitByFields } = apiFilters;

  let query = filter(Tour, req.query);

  // Sort the data
  query = sortData(query, req.query.sort);

  // limit By Fields
  query = limitByFields(query, req.query.fields);

  // Paginate the data
  query = paginateData(query, req.query.page, req.query.limit);

  const tours = await query;

  res.status(200).json({
    status: 'success',
    results: tours.length,
    // envelop the data we want to send with data property.
    data: { tours },
  });
});

exports.getTour = catchAsyncError(async (req, res, next) => {
  const tourId = req.params.id;
  const tour = await Tour.findById(tourId);
  // This below will provide the foundTour inside array
  // const tour = await Tour.find({ _id: tourId });

  // if argument is provided in next function, express assumes it as error.
  if (!tour) return next(new AppError('No tour found with provided ID', 404));

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

exports.createTour = catchAsyncError(async (req, res, next) => {
  const newTour = await Tour.create(req.body);

  res.status(201).json({
    status: 'success',
    results: newTour.length,
    data: {
      tour: newTour,
    },
  });
});

exports.updateTour = catchAsyncError(async (req, res, next) => {
  const tourId = req.params.id;
  const newTour = req.body;
  const tour = await Tour.findByIdAndUpdate(tourId, newTour, {
    new: true,
    runValidators: true,
  });

  if (!tour) return next(new AppError('No tour found with provided ID', 404));

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

exports.deleteTour = catchAsyncError(async (req, res, next) => {
  const tourId = req.params.id;
  const tour = await Tour.findByIdAndDelete(tourId);

  if (!tour) return next(new AppError('No tour found with provided ID', 404));

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

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
