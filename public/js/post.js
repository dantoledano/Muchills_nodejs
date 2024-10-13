import axios from 'axios';
import { showAlert } from './alerts';
const AppError = require('../../utils/appError');
export const addPost = async (text, photos) => {
  try {
    const formData = new FormData();
    formData.append('text', text);

    Array.from(photos).forEach((photo) => {
      formData.append('photos', photo);
    });

    const res = await axios({
      method: 'POST',
      url: `/api/v1/feed/`,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Post submitted successfully');
      window.setTimeout(() => {
        location.reload(true);
      }, 200);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
    console.error(err.response.data.message);
  }
};

export const leaveAComment = async (text, postId) => {
  console.log(text, postId);
  try {
    const res = await axios({
      method: 'POST',
      url: `/api/v1/feed/${postId}/comment`,
      data: {
        text,
      },
    });

    if (res.data.status === 'success') {
      location.reload(true);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const likePost = async (postId) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/feed/${postId}/like`,
    });

    if (res.data.status === 'success') {
      location.reload(true);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
