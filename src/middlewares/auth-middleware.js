const jwt = require('jsonwebtoken');
const User = require('../models/user');
const AppError = require('../config/app-errors');

// eslint-disable-next-line consistent-return
const AuthMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new AppError('No token provided', 401));
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (err) {
      return next(new AppError('Invalid or expired token', 401));
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    req.user = user;
    next();
  } catch (err) {
    return next(new AppError('Something went wrong with authentication', 500));
  }
};

module.exports = AuthMiddleware;
