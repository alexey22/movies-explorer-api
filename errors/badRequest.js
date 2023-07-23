module.exports = class BadRequest extends Error {
  constructor(err) {
    super(err);
    // старая версия, которую не приняли
    // if (err === 'Пользователь с таким email уже существует') {
    //   this.statusCode = 409;
    // } else this.statusCode = 400;
    this.statusCode = 400;
  }
};
