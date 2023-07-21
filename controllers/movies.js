const BadRequest = require('../errors/badRequest');
const Forbidden = require('../errors/forbidden');
const NotFound = require('../errors/notFound');
const ServerError = require('../errors/serverError');
const Movie = require('../models/movie');

const getAllSavedMovies = (req, res, next) => {
  const owner = req.user._id;
  Movie.find({ owner })
    .then((movies) => {
      res.status(200).send(movies);
    })
    .catch(() => {
      next(new ServerError('Произошла ошибка сервера'));
    });
};

const createMovie = (req, res, next) => {
  const owner = req.user._id;
  Movie.create({ ...req.body, owner })
    .then((movie) => {
      res.status(201).send({
        // eslint-disable-next-line dot-notation
        ...movie['_doc'],
        // owner: { _id: movie.owner.toString() },
        owner: movie.owner.toString(),
        _id: movie._id.toString(),
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new BadRequest('Переданы некорректные данные при создании фильма'),
        );
      } else {
        next(new ServerError('Произошла ошибка сервера'));
      }
    });
};

const deleteMovie = (req, res, next) => {
  const movieId = req.params._id;

  const userId = req.user._id;

  Movie.findById(movieId).then((movie) => {
    if (!movie) {
      next(new NotFound('Удаляемый фильм с таким id не найден'));
    } else if (!movie.owner.equals(userId)) {
      next(
        new Forbidden(
          'Пользователь не может удалять фильмы других пользователей',
        ),
      );
    } else {
      Movie.deleteOne(movie) // , { new: true }
        .then((deletedMovie) => {
          res.status(200).send(deletedMovie);
        })
        .catch((err) => {
          if (err.name === 'CastError') {
            next(new BadRequest('Некорректный id фильма'));
          } else {
            next(new ServerError('Произошла ошибка сервера'));
          }
        });
    }
  });
};

module.exports = {
  getAllSavedMovies,
  createMovie,
  deleteMovie,
};
