/*eslint-disable*/
import '@babel/polyfill';
import { displayMap } from './leaflet';
import { login, logout } from './login';
import { updateSettings } from './updateSettings';
import { bookTour } from './stripe';
import { signup } from './signup';
//import { review } from './review';
import { leaveReview } from './reviews';
import { leaveAComment, likePost, addPost } from './post';

//Dom elements
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logoutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const bookBtn = document.getElementById('book-tour');
const signupForm = document.querySelector('.form--signup');
const reviewForm = document.querySelector('form.review--form');
const commentForms = document.querySelectorAll('.comment-form');
const likeButtons = document.querySelectorAll('.like-button');
const addPostForm = document.getElementById('addPostForm');
const posts = document.querySelectorAll('.post-container');

//Delegation
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', logout);
}

if (userDataForm) {
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);

    updateSettings(form, 'data');
  });
}

if (userPasswordForm) {
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating...';
    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password',
    );
    document.querySelector('.btn--save-password').textContent = 'Save Password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
}

if (bookBtn) {
  bookBtn.addEventListener('click', (e) => {
    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });
}

if (signupForm) {
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    document.querySelector('.btn--signup__form').textContent = 'Processing...';
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('password-confirm').value;
    signup(name, email, password, confirmPassword);
  });
}

if (reviewForm) {
  reviewForm.addEventListener('submit', async (e) => {
    const { tourId } = e.target.dataset;
    e.preventDefault();
    document.querySelector('.btn--green').textContent = 'Submitting...';
    const rating = document.getElementById('rating').value;
    const review = document.getElementById('review').value;
    await leaveReview(review, rating, tourId);

    //document.querySelector('.btn--submit-review').textContent = 'Submit Review';
    document.getElementById('rating').value = '';
    document.getElementById('review').value = '';
  });
}

if (addPostForm) {
  addPostForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const content = document.getElementById('postText').value;
    const photos = document.getElementById('postImages').files;

    await addPost(content, photos);
  });
}

const commetOnPost = () => {
  console.log('hello!');
  commentForms.forEach((form) => {
    const postId = form.dataset.postId;
    const textarea = form.querySelector('.comment-input');
    const button = form.querySelector('.submit-comment-btn');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const text = textarea.value.trim();
      if (!text) {
        return;
      }
      button.textContent = 'Submitting..';
      await leaveAComment(text, postId);

      textarea.value = '';
      button.textContent = 'Comment';
    });
  });
};

const likeOnPost = () => {
  likeButtons.forEach((button) => {
    const postId = button.dataset.postId;
    button.addEventListener('click', async () => {
      await likePost(postId);
    });
  });
};

const thumbGallery = () => {
  posts.forEach((post) => {
    const mainPhoto = post.querySelector('.main-photo-img');
    const thumbnails = post.querySelectorAll('.thumbnail-img');

    if (thumbnails.length > 0 && mainPhoto) {
      thumbnails.forEach((thumbnail) => {
        thumbnail.addEventListener('click', (e) => {
          const clickedSrc = e.target.src;

          e.target.src = mainPhoto.src;
          mainPhoto.src = clickedSrc;
        });
      });
    }
  });
};

document.addEventListener('DOMContentLoaded', () => {
  if (commentForms) {
    commetOnPost();
  }

  if (likeButtons) {
    console.log('ho');
    likeOnPost();
  }

  thumbGallery();

  // Check if the current page URL matches the specific pattern
  const isTourPage = window.location.pathname.includes('/tour/');

  if (isTourPage) {
    const reviewCondition = document.querySelector('.review__condition');
    const heading = document.querySelector('.heading-primary');

    // Check if reviewCondition exists and is an Element
    if (reviewCondition && reviewCondition instanceof Element) {
      const reviewObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              reviewCondition.classList.add('show');
            }
          });
        },
        {
          threshold: 0.1,
        },
      );

      reviewObserver.observe(reviewCondition);
    }
    // Check if heading exists and is an Element
    if (heading && heading instanceof Element) {
      const headingObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              heading.classList.add('pop');
            } else {
              heading.classList.remove('pop');
            }
          });
        },
        { threshold: 0.1 },
      );

      headingObserver.observe(heading);
    }
  }
});
