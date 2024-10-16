const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  text: {
    type: String,
    required: [true, 'Comment cannot be empty'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  text: {
    type: String,
    required: [true, 'Post must have text'],
  },
  photos: [String],
  likes: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  ],
  comments: [commentSchema], // Embedded comments
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

postSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  }).populate({
    path: 'comments.user',
    select: 'name photo',
  });
  next();
});

postSchema.set('toJSON', { virtuals: true });
postSchema.set('toObject', { virtuals: true });

postSchema.virtual('formattedDate').get(function () {
  return this.createdAt.toLocaleDateString('en-GB'); // Formats as DD/MM/YYYY
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
