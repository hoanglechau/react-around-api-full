const jwt = require('jsonwebtoken');

const { JWT_SECRET } = process.env;
const UnauthorizedError = require('../errors/unauthorized-error');

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  console.log(authorization);

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Authorization Required'));
  }

  const token = authorization.replace('Bearer ', '');
  console.log(token);
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return next(new UnauthorizedError('Authorization Required'));
  }

  req.user = payload;

  return next();
};

module.exports = auth;
