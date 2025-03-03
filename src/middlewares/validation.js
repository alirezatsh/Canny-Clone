const Joi = require('joi');
const authValidation = require('./user-middleware');

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.details[0].message
      });
    }
    return next();
  };
};

exports.validateRegister = validate(Joi.object(authValidation));
exports.validateLogin = validate(Joi.object(authValidation));
