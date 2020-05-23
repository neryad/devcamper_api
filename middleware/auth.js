const jwt = require("jsonwebtoken");
const asyncHandler = require("./async");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");

// Proctect routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization && 
    req.headers.authorization.startsWith("Bearer")
    ) {
    token = req.headers.authorization.split(' ')[1];
  }

//   else if(req.cookies.token){
//     token = req.cookies.toke;
//   }

// make sure token exits
if(!token){
    return next(new ErrorResponse('No authorize to access this route',401));
}
// Verify toke
try {
    const decode = jwt.verify(token,process.env.JWT_SECRET);
    console.log(decode);
    req.user = await User.findById(decode.id);
    next();
} catch (error) {
    return next(new ErrorResponse('No authorize to access this route',401));
}
});
