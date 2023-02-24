const mongoose = require('mongoose');
const dotenv = require('dotenv');

// handle uncaughtException before app
process.on('uncaughtException', (err) => {
  console.log('uncaughtException:', { [err.name]: err.message });
  process.exit(1);
});

dotenv.config({ path: './config.env' });

const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB)
  .then(() => {
    console.log('DB connection successful');
  })
  .catch((error) => console.log(`Could not connected to database: ${error}`));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
