const express = require('express')
const router = express.Router()
const {LoginUser , RegisterUser} = require('../../controllers/auth-controllers')
const { route } = require('./post-route')

router.post('/v1/register' , RegisterUser )
router.post('/v1/login' , LoginUser)

module.exports = router