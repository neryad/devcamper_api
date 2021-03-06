const express = require('express');
const { protect, authorize } = require('../middleware/auth');
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
}),getCoureses).post(protect,authorize('publisher','admin'),addCourse);
router.route('/:id').get(getCourese).put(protect,authorize('publisher','admin'),updateCourse).delete(protect,authorize('publisher','admin'),deleteCourse);

module.exports = router;