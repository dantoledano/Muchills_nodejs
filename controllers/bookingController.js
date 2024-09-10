const Tour = require('./../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Booking = require('../models/bookingModel');
const factory = require('./handlerFactory');
const { deleteUser } = require('./userController');
const { decodeBase64 } = require('bcryptjs');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  //1) Get the currently booked tour
  const tour = await Tour.findById(req.params.tourId);
  console.log(tour);

  //2) Create checkout session
  //   const session = await stripe.checkout.sessions.create({
  //     payment_method_types: ['card'],
  //     success_url: `${req.protocol}://${req.get('host')}/`,
  //     cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
  //     customer_email: req.user.email,
  //     client_reference_id: req.params.tourId,
  //     line_items: [
  //       {
  //         name: `${tour.name} Tour`,
  //         description: tour.summary,
  //         images: [`https://www.natours.dev/img/tours/${tour.imageCover}`], //jpg?
  //         amount: tour.price * 100,
  //         currency: 'ils',
  //         quantity: 1,
  //       },
  //     ],
  //   });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/?tour=${
      req.params.tourId
    }&user=${req.user.id}&price=${tour.price}`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourID,
    line_items: [
      {
        price_data: {
          unit_amount: tour.price * 100,
          currency: 'usd',
          product_data: {
            name: `${tour.name} Tour`,
            images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
            description: tour.summary,
          },
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
  });
  //   const product = await stripe.products.create({
  //     name: `${tour.name} Tour`,
  //     description: tour.summary,
  //     images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
  //   });

  //   const price = await stripe.prices.create({
  //     product: product.id,
  //     unit_amount: tour.price * 100,
  //     currency: 'usd',
  //   });

  //   const session = await stripe.checkout.sessions.create({
  //     payment_method_types: ['card'],
  //     success_url: `${req.protocol}://${req.get('host')}/`,
  //     cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
  //     customer_email: req.user.email,
  //     client_reference_id: req.params.tourID,
  //     mode: 'payment',
  //     line_items: [
  //       {
  //         price: price.id,
  //         quantity: 1,
  //       },
  //     ],
  //   });
  //3)Creatre session as response
  res.status(200).json({
    status: 'success',
    session,
  });
});

exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  //temporary - unsecure :(
  const { tour, user, price } = req.query;

  if (!tour && !user && !price) {
    return next();
  }

  await Booking.create({ tour, user, price });
  res.redirect(req.originalUrl.split('?')[0]); //home page (214)
});

exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
