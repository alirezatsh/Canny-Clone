const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    title: { type: String, required: true }, 
    message: { type: String, required: true }, 
    imageUrl: { type: String, required: true }, 
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], 
    dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] 
}, { timestamps: true });

module.exports = mongoose.model('Post', PostSchema);
