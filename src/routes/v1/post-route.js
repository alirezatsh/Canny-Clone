const express = require('express');
const { validatePost } = require('../../middlewares/validation');
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

const router = express.Router();

router.post(
  '/api/v1/post',
  AuthMiddleware,
  upload.single('image'),
  validatePost,
  createPost
);
router.get('/api/v1/post', GetAllPosts);
router.get('/api/v1/post/:id', GetSinglePost);
router.delete('/api/v1/post/:id', AuthMiddleware, DeletePost);
router.put(
  '/api/v1/post/:id',
  AuthMiddleware,
  upload.single('image'),
  validatePost,
  UpdatePost
);
router.post('/api/v1/post/vote/:id', AuthMiddleware, votePost);

module.exports = router;
