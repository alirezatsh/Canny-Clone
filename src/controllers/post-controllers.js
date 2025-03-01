const Post = require('../models/post');
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const multer = require('multer');
const path = require('path');
const post = require('../models/post');
require("dotenv").config();

// S3 Client Configuration
const s3 = new S3Client({
    region: "default",
    endpoint: process.env.LIARA_ENDPOINT,
    credentials: {
        accessKeyId: process.env.LIARA_ACCESS_KEY,
        secretAccessKey: process.env.LIARA_SECRET_KEY
    },
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
        ContentType: file.mimetype,
    };

    await s3.send(new PutObjectCommand(params));
    return `${process.env.LIARA_ENDPOINT}/${process.env.LIARA_BUCKET_NAME}/${fileName}`;
};

// Create a new post and upload the image to Liara
const createPost = async (req, res) => {
    try {
        console.log("req.user:", req.user); 

        const { title, message } = req.body;
        if (!title || !message || !req.file) {
            return res.status(400).json({ error: 'please fill all the fields' });
        }

        const imageUrl = await uploadToLiara(req.file);

        const newPost = new Post({ title, message, imageUrl, user: req.user._id });
        await newPost.save();

        res.status(201).json({ message: "post created successfully", post: newPost });
    } catch (error) {
        res.status(500).json({ error: "something went wrong", details: error.message });
    }
};

// Get all available posts
const GetAllPosts = async (req, res) => {
    try {
        const AllPosts = await post.find({});
        if (AllPosts.length > 0) {
            res.status(200).json({
                success: true,
                message: "list of posts fetched successfully",
                data: AllPosts
            });
        } else {
            res.status(404).json({
                success: false,
                message: "no post found"
            });
        }
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "something went wrong"
        });
    }
};

// Get a single post by id
const GetSinglePost = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id);
        if (post) {
            res.status(200).json({
                success: true,
                message: "post fetched successfully",
                data: post
            });
        } else {
            res.status(404).json({
                success: false,
                message: "post not found"
            });
        }
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "something went wrong"
        });
    }
};

// Update a post
const UpdatePost = async (req, res) => {
    try {
        const { id } = req.params;

        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'post not found'
            });
        }

        // Check if the user is the owner of the post
        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "you can not edit this file "
            });
        }

        // If the user is the owner, update the post
        const updatedPost = await Post.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

        res.status(200).json({
            success: true,
            message: 'پست با موفقیت ویرایش شد',
            data: updatedPost
        });

    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: 'چیزی اشتباه پیش آمد، لطفاً دوباره تلاش کنید'
        });
    }
};

// Delete a post
const DeletePost = async (req, res) => {
    try {
        const { id } = req.params;

        if (!req.user || !req.user._id) {
            return res.status(403).json({
                success: false,
                message: "احراز هویت انجام نشده است"
            });
        }

        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "پست پیدا نشد"
            });
        }

        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "شما اجازه حذف این پست را ندارید"
            });
        }

        await post.deleteOne();
        res.status(200).json({
            success: true,
            message: "پست با موفقیت حذف شد"
        });

    } catch (e) {
        console.error("Error in deletePost:", e);
        res.status(500).json({
            success: false,
            message: "چیزی اشتباه پیش آمد"
        });
    }
};


module.exports = { createPost, upload, GetAllPosts, GetSinglePost, DeletePost, UpdatePost };
