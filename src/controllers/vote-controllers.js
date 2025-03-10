const Post = require('../models/post');
const Vote = require('../models/vote');
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

    // Check if the user has already voted on this post
    const existingVote = await Vote.findOne({ post: id, user: userId });

    if (existingVote) {
      // If the vote exists, remove it
      await Vote.deleteOne({ _id: existingVote._id });
      return res.status(200).json({ success: true, message: 'Vote removed', status: 0 });
    }

    // If no vote exists, register a new vote
    const newVote = new Vote({ post: id, user: userId, voteType: 'vote' });
    await newVote.save();

    return res.status(200).json({ success: true, message: 'Vote registered', status: 1 });
  } catch (error) {
    console.error('Vote Error:', error);
    return next(new AppError('Something went wrong', 500));
  }
};

module.exports = { votePost };
