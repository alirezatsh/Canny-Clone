const Joi = require('joi');

const postValidation = Joi.object({
  title: Joi.string().min(5).max(100).required().messages({
    'string.base': 'Title must be a string',
    'any.required': 'Title is required',
    'string.min': 'Title must be at least 5 characters long',
    'string.max': 'Title must have less than or equal to 100 characters'
  }),

  message: Joi.string().min(10).max(1000).required().messages({
    'string.base': 'Message must be a string',
    'string.min': 'Message must be at least 10 characters long',
    'string.max': 'Message must have less than or equal to 1000 characters',
    'any.required': 'Message is required'
  })
});

module.exports = postValidation;
