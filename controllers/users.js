const bcrypt = require('bcryptjs');
const jsonWebToken = require('jsonwebtoken');
const User = require('../models/user');
const UnauthorizedError = require('../errors/unauthorizedError');
const BadRequest = require('../errors/badRequest');
const Conflict = require('../errors/conflict');
const NotFound = require('../errors/notFound');
const ServerError = require('../errors/serverError');

const ErrorText = require('../errors/errorText');

const createUser = (req, res, next) => {
  const { email, password, name } = req.body;

  // проверяем нет ли пользователя с такой почтой
  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new Conflict(ErrorText.duplicateEmail);
      } else {
        bcrypt.hash(String(password), 10).then((hashedPassword) => {
          User.create({
            email,
            password: hashedPassword,
            name,
          })
            .then((userFind) => res.status(201).send({ data: userFind }))
            .catch((err) => {
              if (err.name === 'ValidationError') {
                next(new BadRequest(ErrorText.invalidUserData));
              } else {
                next(new ServerError(ErrorText.serverError));
              }
            });
        });
      }
    })
    .catch(next);
};

const getUser = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .then((user) => {
      if (user) res.status(200).send(user);
      else {
        next(new BadRequest(ErrorText.userIdNotFound));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest(ErrorText.invalidId));
      } else {
        next(new ServerError(ErrorText.serverError));
      }
    });
};

const updateUser = (req, res, next) => {
  const { name, email } = req.body;
  const userId = req.user._id;
  User.findByIdAndUpdate(
    userId,
    { name, email },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (user) {
        res.status(200).send(user);
      } else {
        next(new NotFound(ErrorText.userIdNotFound));
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest(ErrorText.invalidUserData));
      } else if (err.codeName === 'DuplicateKey') {
        next(new Conflict(ErrorText.duplicateEmail));
      } else {
        next(new ServerError(ErrorText.serverError));
      }
    });
};

const login = (req, res, next) => {
  // Вытащить email и password
  const { email, password } = req.body;

  // Проверить существует ли пользователь с таким email
  User.findOne({ email })
    .select('+password')
    .orFail(() => {
      next(new UnauthorizedError(ErrorText.userNotFoundWithEmailPassword));
    })
    .then((user) => {
      // Проверить совпадает ли пароль
      bcrypt
        .compare(String(password), user.password)
        .then((isValidUser) => {
          if (isValidUser) {
            // создать JWT
            const jwt = jsonWebToken.sign(
              {
                _id: user._id,
              },
              // eslint-disable-next-line dot-notation
              process.env['JWT_SECRET'],
              { expiresIn: '7d' },
            );

            // Если совпадает -- вернуть пользователя
            res.send({ ...user.toJSON(), token: jwt });
          } else {
            // Если не совпадает -- вернуть ошибку

            throw new UnauthorizedError(
              ErrorText.userNotFoundWithEmailPassword,
            );
          }
        })
        .catch(next);
    })
    .catch(next);
};

module.exports = {
  createUser,
  getUser,
  updateUser,
  login,
};
