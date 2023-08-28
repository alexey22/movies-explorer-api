const isEmail = require('validator/lib/isEmail');
const isURL = require('validator/lib/isURL');

const BadRequest = require('../errors/badRequest');

const validEmail = (email) => {
  const validate = isEmail(email);
  if (validate) {
    return email;
  }
  throw new BadRequest('Некорректный email');
};

const validUrl = (url) => {
  const validate = isURL(url);
  if (validate) {
    return url;
  }
  throw new BadRequest('Некорректный адрес URL');
};

const validId = (id) => {
  if (/^[0-9a-fA-F]{24}$/.test(id)) {
    return id;
  }
  throw new BadRequest('Передан некорретный id.');
};

module.exports = { validEmail, validId, validUrl };
