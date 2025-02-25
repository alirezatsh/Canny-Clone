const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    title: { type: String, required: true }, // عنوان پست
    message: { type: String, required: true }, // متن پست
    imageUrl: { type: String, required: true }, // لینک عکس ذخیره‌شده در لیارا
}, { timestamps: true });

module.exports = mongoose.model('Post', PostSchema);
