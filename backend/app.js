const express = require('express');

const { PORT = 3000, NODE_ENV, MONGO_URI } = process.env;
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const { errors } = require('celebrate');
require('dotenv').config();
const { requestLogger, errorLogger } = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const limiter = require('./middleware/limiter');
const { localdb, allowedCors, DEFAULT_ALLOWED_METHODS } = require('./utils/config');
const mainRouter = require('./routes/index');

console.log(process.env.NODE_ENV);

const app = express();

mongoose.connect(NODE_ENV === 'production' ? MONGO_URI : localdb);

app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

app.use((req, res, next) => {
  res.header(
    'Access-Control-Allow-Origin',
    allowedCors,
  );
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  );
  res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
  return next();
});

app.use(cors());
app.options('*', cors());
app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Server will crash now');
  }, 0);
});

app.use('/', mainRouter);
app.use(errorLogger);
app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
