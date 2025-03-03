const ratelimit = require('express-rate-limit');

const basiclimit = (maxRequest, time) => {
  return ratelimit({
    max: maxRequest,
    windowMs: time,
    message: 'too many request , please try agian later',
    standardHeaders: true,
    legacyHeaders: false
  });
};

module.exports = { basiclimit };
