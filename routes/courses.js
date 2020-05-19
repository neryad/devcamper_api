const express = require('express');

const {
    getCoureses,
    getCourese,
    addCourse,
    updateCourse,
    deleteCourse
} = require('../controllers/courses');
const Course = require('../models/Course');
const advanceResults = require('../middleware/adavanceResults');
const router = express.Router({mergeParams: true});

router.route('/').get(advanceResults(Course,{
    path:'BootCamp',
    select: 'name description'
}),getCoureses).post(addCourse);
router.route('/:id').get(getCourese).put(updateCourse).delete(deleteCourse);

module.exports = router;