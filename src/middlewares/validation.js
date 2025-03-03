const Joi = require('joi');
const authValidation = require('./user-middleware');
const postValidation = require('./post-middleware');

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

const validateRegister = validate(Joi.object(authValidation));
const validatePost = validate(postValidation);

module.exports = { validateRegister, validatePost };
