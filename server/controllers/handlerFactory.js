const catchAsyncError = require('../helpers/catchAsyncError');
const AppError = require('../helpers/appError');

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
