const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorizedError');

const ErrorText = require('../errors/errorText');

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnauthorizedError(ErrorText.authNeeded));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    // eslint-disable-next-line dot-notation
    payload = jwt.verify(token, process.env['JWT_SECRET']);
  } catch (err) {
    return next(new UnauthorizedError(ErrorText.authNeeded));
  }

  req.user = payload;
  return next();
};

module.exports = auth;
