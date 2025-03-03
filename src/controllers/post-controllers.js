const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const multer = require('multer');
require('dotenv').config();
const Post = require('../models/post');
const AppError = require('../config/app-errors');

// S3 Client Configuration
const s3 = new S3Client({
  region: 'default',
  endpoint: process.env.LIARA_ENDPOINT,
  credentials: {
    accessKeyId: process.env.LIARA_ACCESS_KEY,
    secretAccessKey: process.env.LIARA_SECRET_KEY
  }
});

// Multer setup for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Function to upload image to Liara S3 bucket
const uploadToLiara = async (file) => {
  const fileName = `${Date.now()}-${file.originalname}`;
  const params = {
    Bucket: process.env.LIARA_BUCKET_NAME,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype
  };

  await s3.send(new PutObjectCommand(params));
  return `${process.env.LIARA_ENDPOINT}/${process.env.LIARA_BUCKET_NAME}/${fileName}`;
};

// Create a new post
const createPost = async (req, res, next) => {
  try {
    const { title, message } = req.body;
    if (!title || !message || !req.file) {
      return next(new AppError('Please fill all the fields', 400));
    }

    const imageUrl = await uploadToLiara(req.file);

    const newPost = new Post({
      title,
      message,
      imageUrl,
      user: req.user._id
    });
    await newPost.save();

    return res.status(201).json({ message: 'Post created successfully', post: newPost });
  } catch (error) {
    return next(new AppError('Something went wrong', 500));
  }
};

// Get all posts
const GetAllPosts = async (req, res, next) => {
  try {
    const allPosts = await Post.find({});
    if (allPosts.length > 0) {
      return res.status(200).json({
        success: true,
        message: 'List of posts fetched successfully',
        data: allPosts
      });
    }
    return next(new AppError('No post found', 404));
  } catch (e) {
    return next(new AppError('Something went wrong', 500));
  }
};

// Get a single post
const GetSinglePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) return next(new AppError('Post not found', 404));
    return res
      .status(200)
      .json({ success: true, message: 'Post fetched successfully', data: post });
  } catch (e) {
    return next(new AppError('Something went wrong', 500));
  }
};

// Update a post
const UpdatePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) return next(new AppError('Post not found', 404));

    post.title = req.body.title || post.title;
    post.message = req.body.message || post.message;
    if (req.file) {
      const imageUrl = await uploadToLiara(req.file);
      post.imageUrl = imageUrl;
    }
    await post.save();

    return res
      .status(200)
      .json({ success: true, message: 'Post updated successfully', data: post });
  } catch (e) {
    return next(new AppError('Something went wrong', 500));
  }
};

// Delete a post
const DeletePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!req.user || !req.user._id) return next(new AppError('Unauthorized', 403));

    const post = await Post.findById(id);
    if (!post) return next(new AppError('Post not found', 404));

    if (post.user.toString() !== req.user._id.toString()) {
      return next(new AppError('You do not have permission to delete this post', 403));
    }

    await post.deleteOne();
    return res.status(200).json({ success: true, message: 'Post deleted successfully' });
  } catch (e) {
    return next(new AppError('Something went wrong', 500));
  }
};

module.exports = {
  createPost,
  upload,
  GetAllPosts,
  GetSinglePost,
  DeletePost,
  UpdatePost
};
