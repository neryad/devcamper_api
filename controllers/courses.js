const Course = require('../models/Course');
const BootCamp = require('../models/BootCamps');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc get all coureses
// @route GET/api/v1/courses
// @route GET/api/v1/bootcamp/:bootcampId/courses
// @access Public
exports.getCoureses = asyncHandler(async(req,res,next) => {
    let query;
    if(req.params.bootcamapId){
        query = Course.find({bootcamp: req.params.bootcamapId});
    } else { 
        query = Course.find().populate({
            path:'BootCamp',
            select: 'name description'
        });
    }

    const courses = await query;

    res.status(200).json({
        success: true,
        count: courses.length,
        data: courses
    });
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

    const bootcamp = await BootCamp.findById(req.params.bootcamapId);

    if(!bootcamp) {
        return next(new ErrorResponse(`No bootcamp with the id of ${req.params.bootcamapId}`),404);
    }

    const course = await Course.create(req.body);

    res.status(200).json({
        success: true,
        data: course
    });
});