// eslint-disable-next-line import/no-extraneous-dependencies
const express = require('express');
const { validateRegister } = require('../../middlewares/validation');
const {
  LoginUser,
  RegisterUser,
  ForgotPassword,
  ResetPassword
} = require('../../controllers/auth-controllers');

const router = express.Router();

router.post('/api/v1/register', validateRegister, RegisterUser);
router.post('/api/v1/login', LoginUser);
router.post('/api/v1/forgot-password', ForgotPassword);
router.post('/api/v1/reset-password/:token', ResetPassword);

module.exports = router;
