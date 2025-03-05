class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    if (`${statusCode}`.startsWith('4')) {
      this.status = 'fail';
    } else {
      this.status = 'error';
    }
    this.isOperational = true; // checks that the error is a programming error
    Error.captureStackTrace(this, this.constructor);
  }
}
module.exports = AppError;
