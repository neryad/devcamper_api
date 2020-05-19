const express = require('express');

const {
    getBootcamp,
    getBootcamps,
    deleteBootcamp,
    updateBootcamp,
    createBootcamp,
    getBootcampsInRadius,
    bootcampPhotoUpload
} = require('../controllers/bootcamps');
const Bootcamp = require('../models/BootCamps');
const advanceResults = require('../middleware/adavanceResults');


// Incluse other resource router
const courseRouter = require('./courses');

const router = express.Router();

// re-rourte into other resource router

router.use('/:bootcamapId/courses', courseRouter);

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);

router.route('/')
.get(advanceResults(Bootcamp,'courses'),getBootcamps)
.post(createBootcamp);

router.route('/:id')
.get(getBootcamp)
.put(updateBootcamp)
.delete(deleteBootcamp);

router.route('/:id/photo').put(bootcampPhotoUpload);



module.exports = router;