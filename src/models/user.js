const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null }
  },
  { timestamps: true }
);

UserSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  return next();
});

// eslint-disable-next-line func-names
UserSchema.methods.generateAuthToken = function () {
  const payload = {
    userId: this._id,
    username: this.username
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
  return token;
};

const User = mongoose.model('User', UserSchema);
module.exports = User;
