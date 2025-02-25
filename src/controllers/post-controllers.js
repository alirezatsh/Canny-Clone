const Post = require('../models/post');
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const multer = require('multer');
const path = require('path');
const post = require('../models/post');
require("dotenv").config();

// تنظیمات S3 لیارا
const s3 = new S3Client({
    region: "default",
    endpoint: process.env.LIARA_ENDPOINT,
    credentials: {
        accessKeyId: process.env.LIARA_ACCESS_KEY,
        secretAccessKey: process.env.LIARA_SECRET_KEY
    },
});

// تنظیمات Multer برای آپلود فایل
const storage = multer.memoryStorage();
const upload = multer({ storage });

// تابع آپلود عکس در لیارا
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

// ایجاد پست جدید
const createPost = async (req, res) => {
    try {
        const { title, message } = req.body;
        if (!title || !message || !req.file) {
            return res.status(400).json({ error: 'لطفاً تمام فیلدها را پر کنید.' });
        }

        // آپلود عکس و دریافت لینک آن
        const imageUrl = await uploadToLiara(req.file);

        // ذخیره در دیتابیس
        const newPost = new Post({ title, message, imageUrl });
        await newPost.save();

        res.status(201).json({ message: "پست با موفقیت ایجاد شد!", post: newPost });
    } catch (error) {
        res.status(500).json({ error: "مشکلی در ایجاد پست رخ داد.", details: error.message });
    }
};


const GetAllPosts = async(req , res) => {
    try{
        const AllPosts = await post.find({})
        if(AllPosts?.length > 0){
            res.status(200).json({
                success : true,
                message : "list of posts fetched successfully",
                data:AllPosts
            })
        } else{
            res.status(404).json({
                success: fals,
                message : "no post found"
            })
        }
    }catch(e) {
        console.log(e);
        res.status(500).json({
            success : false,
            message : "something went wrong"
        })
    }
}

const GetSinglePost = async(req , res) => {
    try{
        const {id} = req.params
        const post = await Post.findById(id)
        if(post){
            res.status(200).json({
                success : true,
                message : "post fetched successfully ",
                data: post
            })
        }else{
            res.status(404).json({
                success : false,
                message : "post not found"
            })
        }
    }catch(e){
        console.log(e)
        res.status(500).json({
            success: false,
            message : "somethiong went wrong"
        })
    }
}

const UpdatePost = async(req, res) => {
    try {
        const { id } = req.params
        const updatedpost = await Post.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
        if(updatedpost){
            res.status(200).json({
                success: true,
                message: 'post updated successfully',
                data: updatedpost
            })
        } else {
            res.status(404).json({
                success: false,
                message: 'post not found'
            })
        }
    } catch(e) {
        console.log(e)
        res.status(500).json({
            success: false,
            message: 'something went wrong try again'
        })
    }
}


const DeletePost = async (req, res) => {
    try {
        const { id } = req.params;

        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "post not found"
            });
        }

        await post.deleteOne();

        res.status(200).json({
            success: true,
            message: "post deleted successfully"
        });

    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "something went wrong"
        });
    }
};







module.exports = { createPost, upload , GetAllPosts , GetSinglePost , DeletePost , UpdatePost };
