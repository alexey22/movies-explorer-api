const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { validId, validUrl } = require('../utils/validation');

const {
  getAllSavedMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

router.get('/', getAllSavedMovies);

router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      country: Joi.string().required(),
      director: Joi.string().required(),
      duration: Joi.number().required(),
      year: Joi.string().required(),
      description: Joi.string().required(),
      image: Joi.string().required().custom(validUrl),
      trailerLink: Joi.string().required().custom(validUrl),
      thumbnail: Joi.string().required().custom(validUrl),
      movieId: Joi.number().required(),
      nameRU: Joi.string().required(),
      nameEN: Joi.string().required(),
    }),
  }),
  createMovie,
);

router.delete(
  '/:_id',
  celebrate({
    params: Joi.object().keys({
      _id: Joi.string().required().custom(validId),
    }),
  }),
  deleteMovie,
);

module.exports = router;
