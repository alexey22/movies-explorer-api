require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const { errors } = require('celebrate');
const errorHandler = require('./middlewares/error');

const { requestLogger, errorLogger } = require('./middlewares/logger');

// получаем данные из файла .env
const { NODE_ENV } = process.env;

// если нет файла .env
if (NODE_ENV !== 'production') {
  process.env.NODE_ENV = 'development';
  process.env.JWT_SECRET = 'SUPER-SECRET-KEY';
  process.env.PORT = '3000';
  process.env.BASE_PATH = 'http://localhost:3000';
}

const app = express();

app.use(
  cors({
    origin: [
      'https://musli.nomoredomains.work',
      'http://musli.nomoredomains.work',
      'https://localhost:3001',
      'http://localhost:3001',
      'https://localhost:3000',
      'http://localhost:3000',
    ],
  }),
);

const router = require('./routes');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

const startServer = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/moviesdb', {
      useNewUrlParser: true,
      family: 4,
    });
    // eslint-disable-next-line no-console
    console.log('Успешно подключено к MongoDB');

    try {
      app.listen(process.env.PORT, () => {
        // eslint-disable-next-line no-console
        console.log('Ссылка на сервер');
        // eslint-disable-next-line no-console
        console.log(process.env.BASE_PATH);
      });
      // eslint-disable-next-line no-console
      console.log(`Сервер успешно запущен на порте: ${process.env.PORT}`);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log('Ошибка запуска сервера', err);
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('Ошибка подключения к MongoDB', err);
  }
};

app.use(requestLogger);

app.use(router);

app.use(errorLogger);

app.use(errors()); // обработчик ошибок celebrate

app.use(errorHandler);

startServer();
