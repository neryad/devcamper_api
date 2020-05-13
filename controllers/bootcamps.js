const BootCamp = require('../models/BootCamps');
const geocoder = require('../utils/geocoder');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
// @desc get all bootCamps
// @route GET/api/v1/bootcamps
// @access Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  
    let query;
    let queryStr = JSON.stringify(req.query);

    queryStr = queryStr.replace(/\b(gtgte|lt|lte|in)\b/g, match => `$${match}`);
    
    query =  BootCamp.find(JSON.parse(queryStr));
    
    const bootCamps = await query;
    

    res.status(200).json({ success: true, count:bootCamps.length, data: bootCamps });
 
});

// @desc get single bootCamps
// @route GET/api/v1/bootcamps/:id
// @access Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
 
    const bootcamp = await BootCamp.findById(req.params.id);
    if (!bootcamp) {
      return next(new ErrorResponse(`BootCamp not found with id of ${req.params.id}`, 404));
    }
    res.status(200).json({ success: true, data: bootcamp });

});

// @desc Create a new bootcamp
// @route Post/api/v1/bootcamps/
// @access private
exports.createBootcamp = asyncHandler(async (req, res, next) => {

  const bootcamp = await BootCamp.create(req.body);

  res.status(201).json({
    success: true,
    data: bootcamp,
  });

});

// @desc Update  a  bootcamp
// @route Put/api/v1/bootcamps/:id
// @access private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
 
    const bootCamp = await BootCamp.findByIdAndDelete(req.params.id);

    if (!bootCamp) {
      return next(new ErrorResponse(`BootCamp not found with id of ${req.params.id}`, 404));
    }
    res.status(200).json({ success: true, data: bootCamp });
 
});

// @desc delete a new bootcamp
// @route DELETE/api/v1/bootcamps/:id
// @access private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {

    const bootCamp = await BootCamp.findByIdAndDelete(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!bootCamp) {
      return next(new ErrorResponse(`BootCamp not found with id of ${req.params.id}`, 404));
    }
    res.status(200).json({ success: true, data: {} });

  res
    .status(200)
    .json({ success: true, msg: `delete bootcamps ${req.params.id}` });
});

// @desc Get bootCamps with a radius
// @route Get/api/v1/bootcamps/radius/:zipcode/:distance
// @access private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {

  const { zipcode,distance } = req.params;
  // Get lat/lng from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // Cal radius using radians
  // Divide dist by radius of earth
  //Earth Radius = 3,963 mi / 6,378 km

  const radius = distance / 3963;

  const bootcamps = await BootCamp.find({
    location: { $geoWithin: {$centerSphere:[ [ lng,lat ] , radius ] } }
  });

    res.status(200).json({
      success:true,
      count:bootcamps.length,
      data:bootcamps
    })

});
