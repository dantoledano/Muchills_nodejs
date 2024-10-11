const express = require('express');
const postController = require('../controllers/postController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

// Get all posts (feed)
router
  .route('/')
  .get(postController.getAllPosts)
  .post(postController.setTourUserIds, postController.createPost);

router.route('/:postId/like').patch(postController.likePost);

router
  .route('/:postId/comment')
  .post(postController.setTourUserIds, postController.commentOnPost);

module.exports = router;
