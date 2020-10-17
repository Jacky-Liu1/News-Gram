const mongoose = require('mongoose');

const schema = mongoose.Schema({
  username: String,
  title: String,
  picUrl: String,
  upvotes: Number,
  downvotes: Number,
  comments: [],
  commentCount: Number,
  description: String,
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('schema', schema);