module.exports = class Conflict extends Error {
  constructor(err) {
    super(err);
    this.statusCode = 409;
  }
};
