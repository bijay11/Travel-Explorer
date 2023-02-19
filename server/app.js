const express = require('express');
const fs = require('fs');

const app = express();

// built in middlware - parses incoming JSON requests and puts the parsed data in req.body
app.use(express.json());

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    // envelop the data we want to send with data property.
    data: { tours },
  });
});

app.get('/api/v1/tours/:id', (req, res) => {
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
});

app.post('/api/v1/tours', (req, res) => {
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
});

app.patch('/api/v1/tours/:id', (req, res) => {
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
});

app.delete('/api/v1/tours/:id', (req, res) => {
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
});

const port = 3000;

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
