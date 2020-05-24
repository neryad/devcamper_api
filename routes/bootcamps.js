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
const reviewseRouter = require('./review');

const router = express.Router();
const { protect,authorize } = require('../middleware/auth');

// re-rourte into other resource router

router.use('/:bootcamapId/courses', courseRouter);
router.use('/:bootcamapId/reviews', reviewseRouter);

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);

router.route('/')
.get(advanceResults(Bootcamp,'courses'),getBootcamps)
.post(protect,authorize('publisher','admin'), createBootcamp);

router.route('/:id')
.get(getBootcamp)
.put(protect,authorize('publisher','admin'),updateBootcamp)
.delete(protect, authorize('publisher','admin'),deleteBootcamp);

router.route('/:id/photo').put(protect,authorize('publisher','admin') ,bootcampPhotoUpload);



module.exports = router;