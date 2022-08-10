const express = require('express');
const { getCourses, getCourse, addCourse, updateCourse, deleteCourse } = require('../controller/courses');
const Course = require('../models/Course');
const advanceResult = require('../middleware/advanceResults');
const router = express.Router({ mergeParams:true });
const { protect } = require('../middleware/auth')
router
.route('/')
.get(advanceResult(Course, {
    path:'bootcamp',
    select: 'name description'
}), getCourses)
.post(protect, addCourse);

router
.route('/:id')
.get(getCourse)
.put(protect, updateCourse)
.delete(deleteCourse)
module.exports = router;