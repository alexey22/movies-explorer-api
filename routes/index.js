const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const isEmail = require('validator/lib/isEmail');
const BadRequest = require('../errors/badRequest');

const auth = require('../middlewares/auth');

const userRoutes = require('./users');
const movieRoutes = require('./movies');
const notFoundRoute = require('./notFound');

const { createUser, login } = require('../controllers/users');

const validEmail = (email) => {
  const validate = isEmail(email);
  if (validate) {
    return email;
  }
  throw new BadRequest('Некорректный email');
};

router.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      email: Joi.string().required().email().custom(validEmail),
      password: Joi.string().min(8).required(),
    }),
  }),
  createUser,
);

router.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email().custom(validEmail),
      password: Joi.string().min(8).required(),
    }),
  }),
  login,
);

router.use(auth);

router.use('/users', userRoutes);
router.use('/movies', movieRoutes);
router.use('*', notFoundRoute);

module.exports = router;
