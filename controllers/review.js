const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Review = require("../models/Review");
const Bootcamp = require("../models/BootCamps");

// @desc get all reviews
// @route GET/api/v1/reviews
// @route GET/api/v1/bootcamp/:bootcampId/reviews
// @access Public
exports.getreviews = asyncHandler(async(req,res,next) => {
    
    if(req.params.bootcamapId){
        const reviews = await Bootcamp.find({bootcamp: req.params.bootcamapId});
        return res.status(200).json({
        success:true,
        count: reviews.length,
        data:reviews
        });
    } else { 
      res.status(200).json(res.advanceResults);
    }
});

// @desc get singel reviews
// @route GET/api/v1/reviews/:id
// @access Public
exports.getreview = asyncHandler(async(req,res,next) => {
    const review = await Review.findById(req.params.id).populate({
        path:'BootCamp',
        select: 'name description'
    });

    if(!review){
        return next(new ErrorResponse(`No review found with the id of ${req.params.id}`,404));
    }

    res.status(200).json({
        success:true,
        data:review
    });
});

// @desc Add  reviews 
// @route post/api/v1/bootcamps/:bootcamID/reviews/:id
// @access private
exports.addreview = asyncHandler(async(req,res,next) => {
  req.body.bootcamp = req.params.bootcamapId;
  req.body.user = req.user.id;

  const bootcamp = await Bootcamp.findById(req.params.bootcamapId);

  if(!bootcamp){
   return  next(new ErrorResponse(`No bootcamp find with id:${req.params.bootcamapId}`,404))
  }

  const review = await Review.create(req.body);
    res.status(201).json({
        success:true,
        data:review
    });
});

