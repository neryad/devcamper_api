const express = require('express');

const {
    getCoureses,
    getCourese,
    addCourse,
    updateCourse,
    deleteCourse
} = require('../controllers/courses');

const router = express.Router({mergeParams: true});

router.route('/').get(getCoureses).post(addCourse);
router.route('/:id').get(getCourese).put(updateCourse).delete(deleteCourse);

module.exports = router;