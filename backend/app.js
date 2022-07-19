const express = require('express');
// listen to port 3000
const { PORT = 3000 } = process.env;
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middleware/logger');
require('dotenv').config();
const errorHandler = require('./middleware/errorHandler');

const mainRouter = require('./routes/index');

console.log(process.env.NODE_ENV);

const app = express();

mongoose.connect('mongodb://localhost:27017/aroundb');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

/*
app.use((req, res, next) => {
  const allowedCors = [
    'https://api.hoanglechau.students.nomoredomainssbs.ru',
    'https://www.hoanglechau.students.nomoredomainssbs.ru',
    'https://hoanglechau.students.nomoredomainssbs.ru',
    'localhost:3000',
  ];
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  const { origin } = req.headers;
  const { method } = req;
  const requestHeaders = req.headers['access-control-request-headers'];

  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  res.header('Access-Control-Allow-Origin', '*');

  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }

  return next();
});
*/

const allowedCors = [
  'https://api.hoanglechau.students.nomoredomainssbs.ru',
  'https://www.hoanglechau.students.nomoredomainssbs.ru',
  'https://hoanglechau.students.nomoredomainssbs.ru',
  'localhost:3000',
];

app.use((req, res, next) => {
  res.header(
    'Access-Control-Allow-Origin',
    allowedCors,
  );
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  );
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
  next();
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
