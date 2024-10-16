/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorControllers');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const viewRouter = require('./routes/viewRoutes');
const postRouter = require('./routes/postRoutes');

const app = express();

//Server Side Rendering
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//1) Global middlewares
// Serving static files from the public directory (usually for images, CSS, JS, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Set security HTTP headers https://github.com/helmetjs/helmet
app.use(
  helmet({
    crossOriginResourcePolicy: false,
    crossOriginEmbedderPolicy: false,
  }),
);

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        'default-src': [
          "'self'",
          'https://js.stripe.com/v3/',
          'https://cdnjs.cloudflare.com',
        ],
        'script-src': [
          "'self'",
          'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
          'https://cdnjs.cloudflare.com/ajax/libs/axios/1.7.7/axios.min.js', // Allow Axios
          'https:',
          'http:',
          'blob:',
          'https://js.stripe.com',
          'https://m.stripe.network',
          'https://*.cloudflare.com',
          ,
        ],
        'style-src': [
          "'self'",
          'https://*.googleapis.com',
          'https://unpkg.com',
          'https://cdnjs.cloudflare.com',
          "'unsafe-inline'",
        ],
        'img-src': [
          "'self'",
          'data:',
          'https://*.openstreetmap.org',
          'https://unpkg.com',
          'blob:',
        ],
        frameSrc: ["'self'", 'https://js.stripe.com'],
        formAction: ["'self'"],
        connectSrc: [
          "'self'",
          "'unsafe-inline'",
          'data:',
          'blob:',
          'https://bundle.js:*',
          'https://*.stripe.com',
          'https://*.mapbox.com',
          'https://*.cloudflare.com/',
          'https://api.stripe.com/',
          'ws://127.0.0.1:*/',
        ],
        upgradeInsecureRequests: [],
      },
    },
  }),
);

//Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, // 60 minutes
  message: 'Too many requests from this IP, please try again in an hour.',
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body object
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

//Data sanitization  against NoSQL query injection
app.use(mongoSanitize());

//Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'maxGroupSize',
      'difficulty',
      'price',
      'ratingsAverage',
      'ratingsQuantity',
    ], // allow listed params
  }),
);

app.use(compression());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Routes
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);
app.use('/api/v1/feed', postRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// Error handling middleware
app.use(globalErrorHandler);

module.exports = app;
