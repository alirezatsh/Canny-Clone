const Joi = require('joi');
const AppError = require('../config/app-errors');
const authValidation = require('./user-middleware');
const postValidation = require('./post-middleware');

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return next(new AppError(error.details[0].message, 400));
    }
    return next();
  };
};

const validateRegister = validate(Joi.object(authValidation));
const validatePost = validate(postValidation);

module.exports = { validateRegister, validatePost };
