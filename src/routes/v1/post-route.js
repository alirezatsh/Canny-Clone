const express = require('express')
const router = express.Router()
const {createPost , upload} = require('../../controllers/post-controllers')
const { Route } = require('express')

router.post('/v1/post' , upload.single('image'), createPost)

module.exports = router