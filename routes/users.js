const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const isEmail = require('validator/lib/isEmail');
const BadRequest = require('../errors/badRequest');

const { getUser, updateUser } = require('../controllers/users');

const validEmail = (email) => {
  const validate = isEmail(email);
  if (validate) {
    return email;
  }
  throw new BadRequest('Некорректный email');
};

router.get('/me', getUser);

router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      email: Joi.string().required().email().custom(validEmail),
    }),
  }),
  updateUser,
);

module.exports = router;
