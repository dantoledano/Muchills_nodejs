/*eslint-disable*/
export const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};

//type is 'success' or 'error'
export const showAlert = (type, msg) => {
  hideAlert();
  const doccument = document.documentElement;
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  doccument.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  window.setTimeout(hideAlert, 1500);
};
