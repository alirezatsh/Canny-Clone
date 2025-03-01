const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const User = require('../models/user');

// Forgot Password
const ForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'User not found' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

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
      return res.status(500).json({ success: false, message: 'Failed to send email' });
    }
  } catch (error) {
    console.error('ForgotPassword error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Reset Password
const ResetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
      return res
        .status(400)
        .json({ success: false, message: 'New password is required' });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid or expired token' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    return res.status(200).json({ success: true, message: 'Password reset successful' });
  } catch (error) {
    console.error('ResetPassword error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Register User
const RegisterUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: 'Email or username is already registered' });
    }

    const newUser = new User({ username, email, password });
    await newUser.save();

    return res.status(201).json({ success: true, message: 'Registration successful' });
  } catch (error) {
    console.error('RegisterUser error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Login User
const LoginUser = async (req, res) => {
  try {
    const { identifier, password } = req.body; // Email or username

    if (!identifier || !password) {
      return res
        .status(400)
        .json({ success: false, message: 'Please enter email/username and password' });
    }

    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }]
    });
    if (!user) {
      return res.status(400).json({ success: false, message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Incorrect password' });
    }

    const token = jwt.sign({ userId: user._id.toString() }, process.env.JWT_SECRET_KEY, {
      expiresIn: '7d'
    });

    return res.status(200).json({ success: true, token, message: 'Login successful' });
  } catch (error) {
    console.error('LoginUser error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  LoginUser,
  RegisterUser,
  ResetPassword,
  ForgotPassword
};
