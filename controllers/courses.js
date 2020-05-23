const Course = require('../models/Course');
const BootCamp = require('../models/BootCamps');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc get all coureses
// @route GET/api/v1/courses
// @route GET/api/v1/bootcamp/:bootcampId/courses
// @access Public
exports.getCoureses = asyncHandler(async(req,res,next) => {
    
    if(req.params.bootcamapId){
        const courses = await Course.find({bootcamp: req.params.bootcamapId});
        return res.status(200).json({
        success:true,
        count: courses.length,
        data:courses
        });
    } else { 
      res.status(200).json(res.advanceResults);
    }


});


// @desc get single coureses
// @route GET/api/v1/courses/:id
// @access Public
exports.getCourese = asyncHandler(async(req,res,next) => {

    const course = await  Course.findById(req.params.id).populate({
        path: 'BootCamp',
        select: 'name description'
    });

    if(!course) {
        return next(new ErrorResponse(`No course with the id of ${req.params.id}`),404);
    }

    res.status(200).json({
        success: true,
        data: course
    });
});

// @desc Add  coureses
// @route Post/api/v1/bootcaMPS/:bootcampID/courses/:id
// @access private
exports.addCourse = asyncHandler(async(req,res,next) => {

    req.body.bootcamp = req.params.bootcamapId;
    req.body.user = req.user.id;

    const bootcamp = await BootCamp.findById(req.params.bootcamapId);

    if(!bootcamp) {
        return next(new ErrorResponse(`No bootcamp with the id of ${req.params.bootcamapId}`),404);
    }

       //Make sure that user is bootcamp owner

       if(bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin'){
        return next(
          new ErrorResponse(`User ${req.user.id} is not authorize to add a course to bootcamp ${bootcamp._id}`, 401)
        );
      }

    const course = await Course.create(req.body);

    res.status(200).json({
        success: true,
        data: course
    });
});


// @desc Update  coureses
// @route Put/api/v1/courses/:id
// @access private
exports.updateCourse = asyncHandler(async(req,res,next) => {

    let course = await Course.findById(req.params.id);

    if(!course) {
        return next(new ErrorResponse(`No course with the id of ${req.params.id}`),404);
    }

    //Make sure that user is bootcamp owner

    if(bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin'){
        return next(
          new ErrorResponse(`User ${req.user.id} is not authorize to add a course to bootcamp ${course._id}`, 401)
        );
      }

     course = await Course.findByIdAndUpdate(req.params.id, req.body,{
         new:true,
         data:course
     });

    res.status(200).json({
        success: true,
        data: course
    });
});

// @desc delete  coureses
// @route delete/api/v1/courses/:id
// @access private
exports.deleteCourse = asyncHandler(async(req,res,next) => {

   const course = await Course.findById(req.params.id);

    if(!course) {
        return next(new ErrorResponse(`No course with the id of ${req.params.id}`),404);
    }

     //Make sure that user is bootcamp owner

     if(course.user.toString() !== req.user.id && req.user.role !== 'admin'){
        return next(
          new ErrorResponse(`User ${req.user.id} is not authorize to add a course to bootcamp ${course._id}`, 401)
        );
      }

 await Course.remove();

    res.status(200).json({
        success: true,
        data: {}
    });
});