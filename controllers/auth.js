const User = require("../models/User");
const crypto = require('crypto');
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const sendEmail = require('../utils/sendEmail');

// @desc Register user
// @route Post/api/v1/auth/register
// @access Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  senTokenResponse(user,200, res);
});

// @desc Login user
// @route Post/api/v1/auth/Login
// @access Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email and password
  if (!email || !password) {
    return next(new ErrorResponse("Please provided a email and password", 400));
  }

  // check for the user
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }
  // check if pasword matched
  const isMacht = await user.matchPassword(password);

  if (!isMacht) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }
  //

senTokenResponse(user,200, res);
});

// @desc Get current logged in user
// @route Post/api/v1/auth/me
// @access private

exports.getMe = asyncHandler(async(req,res,next) =>{
  const user = await User.findById(req.user.id);

  res.status(200).json({
    succcess: true,
    data: user
  });
});

// @desc Forgot password current logged in user
// @route Post/api/v1/auth/forgotpassword
// @access public
exports.forgotPassword = asyncHandler(async(req,res,next) =>{
  const user = await User.findOne({email: req.body.email});

  if(!user){
    return next(new ErrorResponse('There is no user whit taht email',404));
  }

  // get rest token

  const resetToken = user.getResetPasswordToken();

  await user.save({validateBeforeSave: false});
  
  //create url
  const restUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`;

  const message = `Your are reciving this email because you (or someone else ) has requested the reset of a password,
  pleade make a put request to:\n\n ${restUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password reset token',
      message
    });

    res.status(200).json({ succcess: true, data:'Email sent'});
  } catch (error) {
    console.log(error);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({validateBeforeSave: false});

    return next(new ErrorResponse('Email could not be sent', 500));
  }

  res.status(200).json({
    succcess: true,
    data: user
  });
});

// @desc Reset password
// @route Post/api/v1/auth/resetPassword/:resettoken
// @access private

exports.resetPassword = asyncHandler(async(req,res,next) => {

  //Get hasToek
  const resetPasswordToken = crypto.createHash('sha256')
  .update(req.params.resettoken)
  .digest('hex');
  console.log(req.params.resettoken,'sd');
  
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: {$gt: Date.now()}
  });

  if(!user){
    return next(new ErrorResponse('invalid token',400))
  }

  //set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire =undefined;

  await user.save();

  senTokenResponse(user,200, res);

});

// @descUpdate user daterails
// @route put/api/v1/auth/updatedeails
// @access private

exports.updateDetails = asyncHandler(async(req,res,next) => {

  const filedsdToUpdate = {
    name:req.body.name,
    email:req.body.email
  }

  const user = await User.findByIdAndUpdate(req.user.id, filedsdToUpdate,{
    new: true,
    runValidators:true
  });

  res.status(200).json({
    succcess: true,
    data: user
  });
});

// @desc Update password
// @route Put/api/v1/auth/updatepassword
// @access private

exports.updatePassword = asyncHandler(async(req,res,next) =>{
  const user = await User.findById(req.user.id).select('+password');

  //check current password
  if(!(await user.matchPassword(req.body.currentPassword))){
    return next(new ErrorResponse('Password is incorrect',401));
  }

  user.password = req.body.newPassword;
  await user.save();

  senTokenResponse(user,200, res);
});

// @desc  Log user out / clear cookie
// @route get /api/v1/auth/logout
// @access private

exports.logout = asyncHandler(async(req,res,next) =>{
  res.cookie('token','none',{
    expires: new Date(Date.now() +10 * 1000),
    httpOnly:true
  });

  res.status(200).json({
    succcess: true,
    data: {}
  });
});

// Get Token from model, create cookie and send response
const senTokenResponse = (user,statusCode,res) => {
  const token = user.getSinedJwToken();

  const options = {
      expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
      httpOnly: true
  };

  if(process.env.NODE_ENV === 'production'){
    options.sucre= true;
  }

  res
  .status(statusCode)
  .cookie('token',token,options)
  .json({
      succcess: true,
      token
  });
};