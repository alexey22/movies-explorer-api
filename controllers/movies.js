const BadRequest = require('../errors/badRequest');
const Forbidden = require('../errors/forbidden');
const NotFound = require('../errors/notFound');
const ServerError = require('../errors/serverError');
const Movie = require('../models/movie');

const ErrorText = require('../errors/errorText');

const getAllSavedMovies = (req, res, next) => {
  const owner = req.user._id;
  Movie.find({ owner })
    .then((movies) => {
      res.status(200).send(movies);
    })
    .catch(() => {
      next(new ServerError(ErrorText.ServerError));
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
        next(new BadRequest(ErrorText.invalidMovieData));
      } else {
        next(new ServerError(ErrorText.ServerError));
      }
    });
};

const deleteMovie = (req, res, next) => {
  const movieId = req.params._id;

  const userId = req.user._id;

  Movie.findById(movieId).then((movie) => {
    if (!movie) {
      next(new NotFound(ErrorText.movieIdNotFound));
    } else if (!movie.owner.equals(userId)) {
      next(new Forbidden(ErrorText.forbiddenMovieDeleteForUser));
    } else {
      Movie.deleteOne(movie) // , { new: true }
        .then((deletedMovie) => {
          res.status(200).send(deletedMovie);
        })
        .catch((err) => {
          if (err.name === 'CastError') {
            next(new BadRequest(ErrorText.invalidId));
          } else {
            next(new ServerError(ErrorText.ServerError));
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
