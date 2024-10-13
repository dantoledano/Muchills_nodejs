import axios from 'axios';
import { showAlert } from './alerts';
const AppError = require('../../utils/appError');

export const leaveReview = async (review, rating, tour) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `/api/v1/tours/${tour}/reviews`,
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
