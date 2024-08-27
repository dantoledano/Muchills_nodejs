const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    result: users.length,
    data: { users },
  });
});
exports.getUser = (req, res) => {
  res.status(500).json({ status: 'error', message: 'Server Error' });
};
exports.createUser = (req, res) => {
  res.status(500).json({ status: 'error', message: 'Server Error' });
};
exports.updateUser = (req, res) => {
  res.status(500).json({ status: 'error', message: 'Server Error' });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({ status: 'error', message: 'Server Error' });
};
