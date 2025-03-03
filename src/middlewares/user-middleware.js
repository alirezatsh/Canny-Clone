const Joi = require('joi');

// validation for user registration
const authValidation = {
  username: Joi.string().min(3).max(20).required().messages({
    'string.base': 'Username must be a string',
    'any.required': 'Username is required',
    'string.min': 'Username must be at least 3 characters long',
    'string.max': 'Username must have less than or equal to 20 characters'
  }),

  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.email': 'Your email is not valid',
      'any.required': 'Email is required'
    }),

  password: Joi.string().min(8).required().messages({
    'string.min': 'Password must be at least 8 characters long',
    'any.required': 'Password is required'
  })
};

module.exports = authValidation;
