const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/userModel');
const Bookings = require('../models/bookingModel');
const Reviews = require('../models/reviewModel');

exports.getOverview = catchAsync(async (req, res, next) => {
  //1) Get tour data from collection
  const tours = await Tour.find();
  //2) Build template

  //3) Render that template using tour data from 1)
  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  //1) Get data, for the requested tour (including reviews and guides)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  if (!tour) {
    return next(
      new AppError('Sorry...  There is no tour with that name.', 404),
    );
  }

  const booking = await Bookings.find({
    user: res.locals.user,
    tour: tour,
  });

  const booked = booking.length > 0 ? true : false;

  //3) Render that template using tour data from 1)

  res
    .status(200)
    .set(
      'Content-Security-Policy',
      "default-src * self blob: data: gap:; style-src * self 'unsafe-inline' blob: data: gap:; script-src * 'self' 'unsafe-eval' 'unsafe-inline' blob: data: gap:; object-src * 'self' blob: data: gap:; img-src * self 'unsafe-inline' blob: data: gap:; connect-src self * 'unsafe-inline' blob: data: gap:; frame-src * self blob: data: gap:;",
    )
    .render('tour', {
      title: `${tour.name} Tour`,
      tour,
      tourId: tour._id.toString(),
      booked,
    });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', { title: 'Log into your account' });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', { title: 'Your Account' });
};

exports.getSignUpForm = (req, res) => {
  res.status(200).render('signup', {
    title: `Create New Account`,
  });
};

exports.getMyTours = catchAsync(async (req, res, next) => {
  //1)find all bookings
  const bookings = await Bookings.find({ user: req.user.id });
  //2)find tours with returned IDs
  const tourIDs = bookings.map((el) => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIDs } });

  res.status(200).render('overview', { title: 'My Tours', tours });
});

exports.getMyReviews = catchAsync(async (req, res, next) => {
  // 1) Find all reviews made by the logged-in user
  const reviews = await Reviews.find({ user: req.user.id });
  //console.log(reviews);
  const showTourName = req.originalUrl.includes('/my-reviews');
  // 2) Render the review cards view
  res.status(200).render('MyReviews', {
    title: 'My Reviews',
    reviews, // Pass the reviews to render review cards
    showTourName, // Show tour name if the URL includes '/my-reviews'
  });
});

exports.updateUserData = catchAsync(async (req, res, next) => {
  const UpdatedUser = await User.findByIdAndUpdate(
    req.user.id,
    { name: req.body.name, email: req.body.email },
    {
      new: true,
      runValidators: true,
    },
  );
  res
    .status(200)
    .render('account', { title: 'Your Account', user: UpdatedUser });
});
