const express = require('express');

const {
    getCoureses,
    getCourese,
    addCourse
} = require('../controllers/courses');

const router = express.Router({mergeParams: true});

router.route('/').get(getCoureses).post(addCourse);
router.route('/:id').get(getCourese);

module.exports = router;