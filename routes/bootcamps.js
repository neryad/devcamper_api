const express = require('express');

const {
    getBootcamp,
    getBootcamps,
    deleteBootcamp,
    updateBootcamp,
    createBootcamp,
    getBootcampsInRadius 
} = require('../controllers/bootcamps');

// Incluse other resource router
const courseRouter = require('./courses');

const router = express.Router();

// re-rourte into other resource router

router.use('/:bootcamapId/courses', courseRouter);

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);

router.route('/')
.get(getBootcamps)
.post(createBootcamp);

router.route('/:id')
.get(getBootcamp)
.put(updateBootcamp)
.delete(deleteBootcamp);



module.exports = router;