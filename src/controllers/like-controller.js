const Post = require('../models/post')

const votePost = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const post = await Post.findById(id);
        if (!post) return res.status(404).json({ success: false, message: "پست پیدا نشد" });

        const hasLiked = post.likes.includes(userId);
        const hasDisliked = post.dislikes.includes(userId);

        if (hasLiked) {
            post.likes.pull(userId);
            await post.save();
            return res.status(200).json({ success: true, message: "لایک حذف شد", status: 0 });
        } else if (hasDisliked) {
            post.dislikes.pull(userId);
            post.likes.push(userId);
            await post.save();
            return res.status(200).json({ success: true, message: "لایک ثبت شد", status: 1 });
        } else {
            post.likes.push(userId);
            await post.save();
            return res.status(200).json({ success: true, message: "لایک ثبت شد", status: 1 });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "خطایی رخ داده است" });
    }
};

module.exports = { votePost };