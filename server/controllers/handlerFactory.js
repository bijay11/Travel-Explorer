const catchAsyncError = require('../helpers/catchAsyncError');
const AppError = require('../helpers/appError');
const apiFilters = require('../helpers/apiFeatures');

exports.deleteOne = (Model) =>
  catchAsyncError(async (req, res, next) => {
    const document = await Model.findByIdAndDelete(req.params.id);

    if (!document)
      return next(new AppError('No document found with provided ID', 404));

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

exports.updateOne = (Model) =>
  catchAsyncError(async (req, res, next) => {
    const documentId = req.params.id;
    const document = await Model.findByIdAndUpdate(documentId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!document)
      return next(new AppError('No document found with provided ID', 404));

    res.status(200).json({
      status: 'success',
      data: {
        document,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsyncError(async (req, res, next) => {
    const newDocument = await Model.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        newDocument,
      },
    });
  });

exports.getOne = (Model, populateOptions) =>
  catchAsyncError(async (req, res, next) => {
    const documentId = req.params.id;

    let query = Model.findById(documentId);
    if (populateOptions) query = query.populate(populateOptions);

    const document = await query;

    // This below will provide the found document inside array
    // const document = await Model.find({ _id: documentId });

    // if argument is provided in next function, express assumes it as error.
    if (!document)
      return next(new AppError('No document found with provided ID', 404));

    res.status(200).json({
      status: 'success',
      data: {
        document,
      },
    });
  });

exports.getAll = (Model) =>
  catchAsyncError(async (req, res, next) => {
    // To allow nested reviews on tour
    let filterTour = {};
    let tour = req.params.tourId;
    if (tour) filterTour = { tour };

    // Filter the Query
    const { filter, sortData, paginateData, limitByFields } = apiFilters;

    const apply = (fn, ...args) => {
      // bind in this case will create a new function
      return fn.bind(null, ...args);
    };

    const pipe =
      (...functions) =>
      (...value) => {
        //   debugger;
        return functions.reduce((currentValue, currentFunction) => {
          // debugger;
          const resFn = currentFunction(...currentValue);
          return Array.isArray(resFn) ? resFn : [resFn];
        }, value)[0];
      };

    const query = pipe(
      apply(filter, req.query, filterTour),
      // log.bind(null, 'asdfsaf', 'asdfsa')
      apply(sortData, req.query.sort),
      apply(limitByFields, req.query.fields),
      apply(paginateData, req.query.page, req.query.limit)
    )(Model);

    // use .explain() to get more info on the query
    const documents = await query;
    res.status(200).json({
      status: 'success',
      results: documents.length,
      // envelop the data we want to send with data property.
      data: { documents },
    });
  });
