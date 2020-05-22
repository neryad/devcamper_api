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
const { protect } = require('../middleware/auth');

// re-rourte into other resource router

router.use('/:bootcamapId/courses', courseRouter);

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);

router.route('/')
.get(advanceResults(Bootcamp,'courses'),getBootcamps)
.post(protect, createBootcamp);

router.route('/:id')
.get(getBootcamp)
.put(protect, updateBootcamp)
.delete(protect, deleteBootcamp);

router.route('/:id/photo').put(protect, bootcampPhotoUpload);



module.exports = router;