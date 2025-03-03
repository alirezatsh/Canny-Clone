const Post = require('../models/post');
const AppError = require('../config/app-errors');

const votePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user && req.user._id;

    if (!userId) {
      return next(new AppError('User not authenticated', 401));
    }

    const post = await Post.findById(id);
    if (!post) {
      return next(new AppError('Post not found', 404));
    }

    const hasLiked = post.likes.includes(userId);
    const hasDisliked = post.dislikes.includes(userId);

    if (hasLiked) {
      post.likes.pull(userId);
      await post.save();
      return res.status(200).json({ success: true, message: 'Vote deleted', status: 0 });
    }

    if (hasDisliked) {
      post.dislikes.pull(userId);
      post.likes.push(userId);
      await post.save();
      return res
        .status(200)
        .json({ success: true, message: 'Vote registered', status: 1 });
    }

    post.likes.push(userId);
    await post.save();
    return res.status(200).json({ success: true, message: 'Vote registered', status: 1 });
  } catch (error) {
    return next(new AppError('Something went wrong', 500));
  }
};

module.exports = { votePost };
