const express = require('express')
const router = express.Router()
const {createPost , upload , GetAllPosts , GetSinglePost , DeletePost , UpdatePost} = require('../../controllers/post-controllers')
const {votePost} = require('../../controllers/vote-controllers')
const AuthMiddleware = require('../../middlewares/auth-middleware')

router.post('/v1/post', AuthMiddleware , upload.single('image'), createPost)
router.get('/v1/post' , GetAllPosts)
router.get('/v1/post/:id' , GetSinglePost)
router.delete('/v1/post/:id', AuthMiddleware  , DeletePost)
router.put('/v1/post/:id' , AuthMiddleware , UpdatePost)
router.post('/v1/post/vote/:id', AuthMiddleware, votePost);


module.exports = router

