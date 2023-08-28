const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { validEmail } = require('../utils/validation');

const { getUser, updateUser } = require('../controllers/users');

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
