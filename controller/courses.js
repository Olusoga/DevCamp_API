const ErrorResponse = require('../utils/errorResponse');

const asyncHandler = require('../middleware/async');

const Course = require('../models/Course');

const Bootcamp= require('../models/Bootcamp')

//@desc   Get all courses
//@route Get api/courses/v1
//@route Get api/bootcamps/:bootcampId/courses/v1
//@access public

exports.getCourses = asyncHandler(async (req, res, next) => {
    let query;

    if(req.params.bootcampId){
        query = Course.find({bootcamp:req.params.bootcampId})
    }else{
        query = Course.find().populate({
            path:'bootcamp',
            select: 'name description'
        });
    }

    const courses = await query;

    res.status(200).json({
        success: true,
        count: courses.length,
        data:courses
    })
});

//@desc   Get a course
//@route Get api/course/v1
//@access public

exports.getCourse = asyncHandler(async (req, res, next) => {
    const course = await Course.findById(req.params.id).populate({
        path: 'bootcamp',
        select: 'name description'
    })
    if(!course){
        return next(
            new ErrorResponse(`No course with the id of ${req.params.id}`,
            404)
        )
    }

    res.status(200).json({
        success: true,
        data:course
    })
});
//@desc   Create a bootcamp
//@route Get api/bootcamps/:bootcampId/courses
//@access private
exports.addCourse =asyncHandler(async (req, res, next)=> {
    req.body.bootcamp = req.params.bootcampId;

    const bootcamp = await Bootcamp.findById(req.params.bootcampId);
    if(!bootcamp){
       return next(
           new ErrorResponse(`no bootcamp with the id ${req.params.id}`)
       )
    }    
    const course = await Course.create(req.body);
   return res.status(201).json({
        success: true,
        data: course
        })
   
});

//@desc   update
//@route update api/bootcamps/v1
//@access privates
exports.updateCourse =  asyncHandler(async(req, res, next) => {
    let course = await Course.findById(req.params.id);
    if(!course){
        return next(new ErrorResponse(`Course with id ${req.params.id} not found`, 404)
        );
   }    


     course = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators:true
    });
    res.status(200).json({
        success: true, 
        data: course
    })

});

//@desc   delete course
//@route delete api/course/v1
//@access private
exports.deleteCourse = asyncHandler( async (req, res, next) => {
    const course = await Course.findByIdAndDelete(req.params.id)
    if(!course){
       return next(new ErrorResponse(`Course with id ${req.params.id} not found`, 404)
       );
        
    }
    res.status(200).json({
        success: true,
         data: {}
         })
    

});