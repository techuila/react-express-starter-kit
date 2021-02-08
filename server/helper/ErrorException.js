module.exports = class ErrorException {
  constructor(status, message, additional = {}) {
    this.status = status;
    this.message = message;
    this.additional = additional;
  }
};
