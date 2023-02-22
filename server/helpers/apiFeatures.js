exports.filter = (ApiModel, reqQuery) => {
  const queryObj = { ...reqQuery };
  const excludedFields = ['page', 'sort', 'limit', 'fields'];
  excludedFields.forEach((el) => delete queryObj[el]);

  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
  queryStr = JSON.parse(queryStr);

  return ApiModel.find(queryStr);
};

exports.sortData = (query, reqQuerySort) => {
  if (reqQuerySort) {
    const sortBy = reqQuerySort.split(',').join(' ');
    return query.sort(sortBy);
  }
  return query.sort('-createdAt');
};

exports.limitByFields = (query, reqQueryFields) => {
  if (!reqQueryFields) return query.select('-__v');
  const fields = reqQueryFields.split(',').join(' ');
  return query.select(fields);
};

exports.paginateData = (query, reqQueryPage = 1, reqQueryLimit = 100) => {
  const skip = (reqQueryPage - 1) * reqQueryLimit;
  return query.skip(skip).limit(reqQueryLimit);
};
