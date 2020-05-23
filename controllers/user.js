const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

// @desc gell al user
// @route Get/api/v1/auth/users
// @access Private/Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advanceResults);
});

// @desc gell single user
// @route Get/api/v1/auth/users/:id
// @access Private/Admin
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  res.status(200).json({
    succues: true,
    data: user,
  });
});

// @desc Create a user
// @route Post/api/v1/auth/users
// @access Private/Admin
exports.createUser = asyncHandler(async (req, res, next) => {
    const user = await User.create(req.body);

    res.status(201).json({
        succues: true,
        data: user,
      });
});

// @desc Update a user
// @route put/api/v1/auth/users
// @access Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new:true,
        runValidators:true
    });
    

    res.status(200).json({
        succues: true,
        data: user,
      });
});

// @desc Delete a user
// @route put/api/v1/auth/users
// @access Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
        succues: true,
        data: {},
      });
});




