const Post = require('../models/postModel');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');
const sharp = require('sharp');
const multer = require('multer');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an allowed image type', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadPostImages = upload.array('photos', 5);

exports.resizePostImages = catchAsync(async (req, res, next) => {
  if (!req.files) return next();

  req.body.photos = [];
  await Promise.all(
    req.files.map(async (file, i) => {
      const filename = `post-${Date.now()}-${i + 1}.jpeg`;
      await sharp(file.buffer)
        .resize(500, 500)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/posts/${filename}`);

      req.body.photos.push(filename);
    }),
  );

  next();
});

exports.setTourUserIds = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllPosts = factory.getAll(Post);
exports.createPost = factory.createOne(Post);
exports.deletePost = factory.deleteOne(Post);

exports.likePost = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.postId);

  if (!post) {
    return next(new AppError('Post not found', 404));
  }

  const alreadyLiked = post.likes.includes(req.user.id);

  if (alreadyLiked) {
    // If already liked, unlike the post (remove the user from likes array)
    post.likes = post.likes.filter(
      (userId) => userId.toString() !== req.user.id.toString(),
    );
  } else {
    post.likes.push(req.user.id);
  }

  await post.save();
  res.status(200).json({
    status: 'success',
    data: {
      post,
    },
  });
});

exports.commentOnPost = catchAsync(async (req, res, next) => {
  const { text } = req.body;

  if (!text || text.trim().length === 0) {
    return next(new AppError('Comment cannot be empty', 400));
  }

  const post = await Post.findById(req.params.postId);

  if (!post) {
    return next(new AppError('Post not found', 404));
  }

  // Add the new comment to the comments array
  post.comments.push({
    user: req.user.id,
    text,
    createdAt: Date.now(),
  });

  await post.save();

  res.status(201).json({
    status: 'success',
    data: {
      post,
    },
  });
});
