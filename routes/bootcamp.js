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


//re-route into other resource

router.use('/:bootcampId/courses', courseRouter)
router
.route('/radius/:zipcode/:distance')
.get(getBootCampInRadius);

// router without Id
router
.route('/')
.get(advanceResult(Bootcamp, 'courses'), getBootCamps)
.post(createBootCamp);

//Upload file

router
.route('/:id/photo')
.put(bootCampUploadPhoto)

//router with Id
router
.route('/:id')
.get( getBootCamp)
.put(updateBootCamp)
.delete(deleteBootCamp);

module.exports = router;