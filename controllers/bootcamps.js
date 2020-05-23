const path = require("path");
const BootCamp = require("../models/BootCamps");
const geocoder = require("../utils/geocoder");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
// @desc get all bootCamps
// @route GET/api/v1/bootcamps
// @access Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advanceResults);
});

// @desc get single bootCamps
// @route GET/api/v1/bootcamps/:id
// @access Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await BootCamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`BootCamp not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: bootcamp });
});

// @desc Create a new bootcamp
// @route Post/api/v1/bootcamps/
// @access private
exports.createBootcamp = asyncHandler(async (req, res, next) => {

  //Add user to req.body
  req.body.user = req.user.id;

  // check for publis bootcamp
  const publishedBootCamp = await BootCamp.findOne({user: req.user.id});

  // if user is not afmin con only add one bootcam
  if(publishedBootCamp && req.user.role !=='admin') {

    return next(new ErrorResponse(`User with ID ${req.user.id} has already published a bootcamp`,400));
}


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
    return next(
      new ErrorResponse(`BootCamp not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: bootCamp });
});

// @desc delete a new bootcamp
// @route DELETE/api/v1/bootcamps/:id
// @access private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootCamp = await BootCamp.findById(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!bootCamp) {
    return next(
      new ErrorResponse(`BootCamp not found with id of ${req.params.id}`, 404)
    );
  }
  bootCamp.remove();
  res.status(200).json({ success: true, data: {} });

  res
    .status(200)
    .json({ success: true, msg: `delete bootcamps ${req.params.id}` });
});

// @desc Get bootCamps with a radius
// @route Get/api/v1/bootcamps/radius/:zipcode/:distance
// @access private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;
  // Get lat/lng from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // Cal radius using radians
  // Divide dist by radius of earth
  //Earth Radius = 3,963 mi / 6,378 km

  const radius = distance / 3963;

  const bootcamps = await BootCamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});

// @desc upload photo for bootcamp
// @route Put/api/v1/bootcamps/:id/photo
// @access private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  const bootCamp = await BootCamp.findById(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!bootCamp) {
    return next(
      new ErrorResponse(`BootCamp not found with id of ${req.params.id}`, 404)
    );
  }

  if (!req.files) {
    return next(new ErrorResponse(`Please select a file`, 400));
  }
  //res.status(200).json({ success: true, data: {} });
  const file = req.files.file;

  //Make suere the image is a photo
  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse(`Please upload a image file`, 400));
  }
  // chel file size
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload a image less than ${MAX_FILE_UPLOAD}`,
        400
      )
    );
  }

  //Custom name for file
  file.name = `photo_${bootCamp._id}${path.parse(file.name).ext}`;
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problema with file upload`, 500));
    }
    await BootCamp.findByIdAndUpdate(req.params.id,{photo: file.name});
  });

  res
    .status(200)
    .json({ success: true, data: file.name });
});
