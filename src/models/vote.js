const mongoose = require('mongoose');

const VoteSchema = new mongoose.Schema(
  {
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    voteType: { type: String, default: 'vote', required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Vote', VoteSchema);
