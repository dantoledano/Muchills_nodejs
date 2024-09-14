const mongoose = require('mongoose');
const dotenv = require('dotenv');

//safety check
process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection - shutting down server');
  console.log(err);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection successfull!'));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

process.on('uncaughtException', (/*err*/) => {
  console.error('Uncaught Exception - shutting down server');
  console.log(err.message);
  server.close(() => {
    console.log('Server is closed');
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received - shutting down server');
  server.close(() => {
    console.log('Server is closed');
  });
});
