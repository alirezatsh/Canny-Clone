const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const multer = require('multer');
require('dotenv').config();
const Post = require('../models/post');

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

// Create a new post and upload the image to Liara
const createPost = async (req, res) => {
  try {
    const { title, message } = req.body;
    if (!title || !message || !req.file) {
      return res.status(400).json({ error: 'please fill all the fields' });
    }

    const imageUrl = await uploadToLiara(req.file);

    const newPost = new Post({
      title,
      message,
      imageUrl,
      user: req.user._id
    });
    await newPost.save();

    return res.status(201).json({ message: 'post created successfully', post: newPost });
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'something went wrong', details: error.message });
  }
};

// Get all available posts
const GetAllPosts = async (req, res) => {
  try {
    const allPosts = await Post.find({});
    if (allPosts.length > 0) {
      return res.status(200).json({
        success: true,
        message: 'list of posts fetched successfully',
        data: allPosts
      });
    }
    return res.status(404).json({
      success: false,
      message: 'no post found'
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: 'something went wrong'
    });
  }
};

// Get a single post by id
const GetSinglePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (post) {
      return res.status(200).json({
        success: true,
        message: 'post fetched successfully',
        data: post
      });
    }
    return res.status(404).json({
      success: false,
      message: 'post not found'
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: 'something went wrong'
    });
  }
};

// Update a post
const UpdatePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    post.title = req.body.title || post.title;
    post.message = req.body.message || post.message;
    if (req.file) {
      const imageUrl = await uploadToLiara(req.file);
      post.imageUrl = imageUrl;
    }

    await post.save();

    return res.status(200).json({
      success: true,
      message: 'Post updated successfully',
      data: post
    });
  } catch (e) {
    return res.status(500).json({ success: false, message: 'Something went wrong' });
  }
};

// Delete a post
const DeletePost = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.user || !req.user._id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this post'
      });
    }

    await post.deleteOne();
    return res.status(200).json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: 'Something went wrong'
    });
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
