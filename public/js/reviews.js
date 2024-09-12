import axios from 'axios';
import { showAlert } from './alerts';
const AppError = require('../../utils/appError');

export const leaveReview = async (review, rating, tour) => {
  // if (!booked) {
  //   return new AppError('You must to book this tour to leave a review.', 403);
  // }
  try {
    const res = await axios({
      method: 'POST',
      url: `http://127.0.0.1:3000/api/v1/tours/${tour}/reviews`,
      data: {
        review,
        rating,
        tour,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Review submitted successfully');
      window.setTimeout(() => {
        location.reload(true);
      }, 1000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
