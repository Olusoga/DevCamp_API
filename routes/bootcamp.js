const express = require('express');

const { getBootCamps,
        getBootCamp,
        createBootCamp,
        updateBootCamp,
        deleteBootCamp,
        getBootCampInRadius,
        bootCampUploadPhoto } = require('../controller/bootcamps');

const Bootcamp = require('../models/Bootcamp');
    
const advanceResult = require('../middleware/advanceResults');


//Include other resource
const courseRouter = require('./Course');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth')


//re-route into other resource

router.use('/:bootcampId/courses', courseRouter)
router
.route('/radius/:zipcode/:distance')
.get(getBootCampInRadius);

// router without Id
router
.route('/')
.get(advanceResult(Bootcamp, 'courses'), getBootCamps)
.post(protect, authorize("publisher", "admin"), createBootCamp);

//Upload file

router
.route('/:id/photo')
.put(protect, authorize("publisher", "admin"), bootCampUploadPhoto)

//router with Id
router
.route('/:id')
.get( getBootCamp)
.put(protect, authorize("publisher", "admin"), updateBootCamp)
.delete(protect, authorize("publisher", "admin"), deleteBootCamp);

module.exports = router;