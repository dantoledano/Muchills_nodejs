const mongoose = require('mongoose');
const Tour = require('./tourModel');

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

//To prevent duplicate reviews from the same user to the same tour
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'tour',
    select: 'name _id',
  }).populate({
    path: 'user',
    select: 'name _id photo',
  });
  next();
});

reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5, //Default
    });
  }
};

reviewSchema.post(/save|^findOneAnd/, async (doc) => {
  await doc.constructor.calcAverageRatings(doc.tour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
