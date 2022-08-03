const express = require('express');

const { getBootCamps,
        getBootCamp,
        createBootCamp,
        updateBootCamp,
        deleteBootCamp,
        getBootCampInRadius } = require('../controller/bootcamps');

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
.get(getBootCamps)
.post(createBootCamp);

//router with Id
router
.route('/:id')
.get( getBootCamp)
.put(updateBootCamp)
.delete(deleteBootCamp);

module.exports = router;