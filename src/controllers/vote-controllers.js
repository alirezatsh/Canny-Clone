const Post = require('../models/post');

const votePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user && req.user._id; // بررسی وجود _id در req.user

    if (!userId) {
      return res.status(400).json({ success: false, message: 'User not authenticated' });
    }

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
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
    console.error('Error:', error);
    return res
      .status(500)
      .json({ success: false, message: 'Something went wrong', error: error.message });
  }
};

module.exports = { votePost };
