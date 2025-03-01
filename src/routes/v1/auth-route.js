const express = require('express');

const router = express.Router();
const {
  LoginUser,
  RegisterUser,
  ForgotPassword,
  ResetPassword
} = require('../../controllers/auth-controllers');

router.post('/v1/register', RegisterUser);
router.post('/v1/login', LoginUser);
router.post('/v1/forgot-password', ForgotPassword);
router.post('/v1/reset-password/:token', ResetPassword);

module.exports = router;
