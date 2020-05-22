const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

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

// Get Token from model, create cookie and send response

const senTokenResponse = (user,statusCode,res) => {
    const token = user.getSinedJwToken();

    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 *1000),
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