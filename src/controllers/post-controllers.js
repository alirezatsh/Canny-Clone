const Post = require('../models/post');
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const multer = require('multer');
const path = require('path');
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

module.exports = { createPost, upload };
