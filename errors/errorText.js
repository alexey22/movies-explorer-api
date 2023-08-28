const ErrorText = {
  duplicateEmail: 'Пользователь с таким email уже существует',
  invalidUserData: 'Переданы некорректные данные пользователя',
  serverError: 'Произошла ошибка сервера',
  userIdNotFound: 'Пользователь с данным id не найден',
  invalidId: 'Некорректный id',
  userNotFoundWithEmailPassword:
    'Пользователь с таким email и паролем не найден',
  movieIdNotFound: 'Фильм с данным id не найден',
  invalidMovieData: 'Переданы некорректные данные фильма',
  forbiddenMovieDeleteForUser:
    'Пользователь не может удалять фильмы других пользователей',
  authNeeded: 'Необходима авторизация',
};

module.exports = ErrorText;
