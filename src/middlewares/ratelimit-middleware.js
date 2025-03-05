const ratelimit = require('express-rate-limit');
const AppError = require('../config/app-errors');

const basiclimit = (maxRequest, time) => {
  return ratelimit({
    max: maxRequest,
    windowMs: time,
    message: new AppError('Too many requests, please try again later', 429),
    standardHeaders: true,
    legacyHeaders: false
  });
};

module.exports = { basiclimit };
