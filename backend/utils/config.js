const localdb = 'mongodb://localhost:27017/aroundb';
const devkey = 'dev-secret-key';
const allowedCors = [
  'https://api.hoanglechau.students.nomoredomainssbs.ru',
  'https://www.hoanglechau.students.nomoredomainssbs.ru',
  'https://hoanglechau.students.nomoredomainssbs.ru',
  'localhost:3000',
];
const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

module.exports = {
  localdb, devkey, allowedCors, DEFAULT_ALLOWED_METHODS,
};
