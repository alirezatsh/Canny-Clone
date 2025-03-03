const express = require('express');

const router = express.Router();
const {
  createPost,
  upload,
  GetAllPosts,
  GetSinglePost,
  DeletePost,
  UpdatePost
} = require('../../controllers/post-controllers');
const { votePost } = require('../../controllers/vote-controllers');
const AuthMiddleware = require('../../middlewares/auth-middleware');

router.post('/api/v1/post', AuthMiddleware, upload.single('image'), createPost);
router.get('/api/v1/post', GetAllPosts);
router.get('/api/v1/post/:id', GetSinglePost);
router.delete('/api/v1/post/:id', AuthMiddleware, DeletePost);
router.put('/api/v1/post/:id', upload.single('image'), AuthMiddleware, UpdatePost);
router.post('/api/v1/post/vote/:id', AuthMiddleware, votePost);

module.exports = router;
