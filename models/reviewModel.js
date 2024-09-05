const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review must not be empty'],
      minlength: 3, //to allow 'bad' :)
      maxlength: [500, 'Review must not exceed 500 characters'],
    },
    rating: {
      type: Number,
      min: [1, 'Rating must be above or equal to 1'],
      max: [5, 'Rating must be below or equal to 5'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    tour:
      // referenced and not embedded
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: [true, 'Review must belong to a tour'],
      },
    user:
      // referenced and not embedded
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Review must belong to a user'],
      },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

reviewSchema.pre(/^find/, function (next) {
  //   this.populate({
  //     path: 'tour',
  //     select: 'name _id',
  //   }).populate({
  //     path: 'user',
  //     select: 'name _id', //photo ?
  //   });

  this.populate({
    path: 'user',
    select: 'name _id photo', //photo ?
  });
  next();
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
