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

    let query = filter(Model, req.query, filterTour);

    // Sort the data
    query = sortData(query, req.query.sort);

    // limit By Fields
    query = limitByFields(query, req.query.fields);

    // Paginate the data
    query = paginateData(query, req.query.page, req.query.limit);

    const pipe =
      (...functions) =>
      (value) => {
      //   debugger;
        return functions.reduce((currentValue, currentFunction) => {
        // debugger;
          return currentFunction(currentValue);
        }, value);
      };

    console.log(
      'test pipe',
      pipe(
        filter,
        sortData,
        limitByFields,
        paginateData
      )(Model, req.query, filterTour)
    );

    // use .explain() to get more info on the query
    const documents = await query;
    res.status(200).json({
      status: 'success',
      results: documents.length,
      // envelop the data we want to send with data property.
      data: { documents },
    });
  });
