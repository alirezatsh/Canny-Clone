const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const User = require('../models/user');
const AppError = require('../config/app-errors');

// Forgot Password
const ForgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return next(new AppError('Email is required', 400));
    }

    const user = await User.findOne({ email });
    if (!user) {
      return next(new AppError('User not found', 400));
    }

    const resetToken = crypto.randomBytes(32).toString('hex');

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    try {
      await user.save();
      console.log(' User token saved in DB:', user.resetPasswordToken);
    } catch (dbError) {
      console.error(' Error saving user token:', dbError);
    }

    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
      }
    });

    const resetURL = `http://localhost:3000/reset-password/${resetToken}`;

    const mailOptions = {
      from: `"My App" <${process.env.MAIL_FROM}>`,
      to: user.email,
      subject: 'Password Reset Request',
      html: `<p>You requested a password reset.</p>
             <p>Click <a href="${resetURL}">here</a> to reset your password.</p>
             <p>If you did not request this, please ignore this email.</p>`
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent: ', info.response);
      return res
        .status(200)
        .json({ success: true, message: 'Reset link sent to your email' });
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      return next(new AppError('Failed to send email', 500));
    }
  } catch (error) {
    console.error('ForgotPassword error:', error);
    return next(new AppError('Server error', 500));
  }
};

// Reset Password
const ResetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return next(new AppError('New password is required', 400));
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return next(new AppError('Invalid or expired token', 400));
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    console.log('New hashed password:', user.password);

    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    return res.status(200).json({ success: true, message: 'Password reset successful' });
  } catch (error) {
    console.error('ResetPassword error:', error);
    return next(new AppError('Server error', 500));
  }
};

// Register User
const RegisterUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return next(new AppError('All fields are required', 400));
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return next(new AppError('Email or username is already registered', 400));
    }

    const newUser = new User({ username, email, password });
    await newUser.save();

    return res.status(201).json({ success: true, message: 'Registration successful' });
  } catch (error) {
    console.error('RegisterUser error:', error);
    return next(new AppError('Server error', 500));
  }
};

// Login User
const LoginUser = async (req, res, next) => {
  try {
    const { identifier, password } = req.body; // Email or username

    if (!identifier || !password) {
      return next(new AppError('Please enter email/username and password', 400));
    }

    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }]
    });
    if (!user) {
      return next(new AppError('User not found', 400));
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(new AppError('Incorrect password', 400));
    }

    const token = jwt.sign({ userId: user._id.toString() }, process.env.JWT_SECRET_KEY, {
      expiresIn: '7d'
    });

    return res.status(200).json({ success: true, token, message: 'Login successful' });
  } catch (error) {
    console.error('LoginUser error:', error);
    return next(new AppError('Server error', 500));
  }
};

module.exports = {
  LoginUser,
  RegisterUser,
  ResetPassword,
  ForgotPassword
};
