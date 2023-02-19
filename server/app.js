const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

const app = express();

// Middlwares start here
app.use(morgan('dev'));

// built in middlware - parses incoming JSON requests and puts the parsed data in req.body
app.use(express.json());
// Middlwares ends here

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// Route Handlers start here
const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    // envelop the data we want to send with data property.
    data: { tours },
  });
};

const getTour = (req, res) => {
  const tourId = +req.params.id;

  if (tourId > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid tour id',
    });
  }

  const tour = tours.find((el) => el.id === tourId);

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

const createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      console.log('test err', err);
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

const updateTour = (req, res) => {
  const tourId = +req.params.id;

  if (tourId > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid tour id',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: 'Updated tour',
    },
  });
};

const deleteTour = (req, res) => {
  const tourId = +req.params.id;

  if (tourId > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid tour id',
    });
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
};
// Route Handlers end here

// Routes starts here
app.route('/api/v1/tours').get(getAllTours).post(createTour);
app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);
// Routes ends here

// Start Server
const port = 3000;

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
