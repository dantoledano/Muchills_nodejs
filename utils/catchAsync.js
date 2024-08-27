/* eslint-disable arrow-body-style */
//in order to remove all try-catch blocks
module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  }; //send the error to middleware error handler
};
