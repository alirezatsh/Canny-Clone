const express = require('express')
const router = express.Router()
const {createPost , upload , GetAllPosts , GetSinglePost , DeletePost , UpdatePost} = require('../../controllers/post-controllers')

router.post('/v1/post' , upload.single('image'), createPost)
router.get('/v1/post' , GetAllPosts)
router.get('/v1/post/:id' , GetSinglePost)
router.delete('/v1/post/:id' , DeletePost)
router.put('/v1/post/:id' , UpdatePost)

module.exports = router