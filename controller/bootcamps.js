const ErrorResponse = require('../utils/errorResponse');

const asyncHandler = require('../middleware/async');

const geocoder = require('../utils/geocode');
const Bootcamp = require('../models/Bootcamp');

//@desc   Get all bootcamps
//@route Get api/bootcamps/v1
//@access public

exports.getBootCamps = asyncHandler(async (req, res, next) => {

    let query;
    //copy req.query
    const reqQuery = {...req.query};

    //Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];

    //loop over removeFields and delete them fro reqQuery

    removeFields.forEach(param => delete reqQuery[param]);

    //create query string
          let queryStr = JSON.stringify(reqQuery);
    //create operator($gt, gte lt lte)
          queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match=>`$${match}`);

    // Finding resources
          query = Bootcamp.find(JSON.parse(queryStr)).populate('courses');

    //select field

    if(req.query.select){
        const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);

}

   //sort field
   if(req.query.sort){
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);

   }else{
       query = query.sort('-createdAt');
   }

   //pagination
   const page = parseInt(req.query.page, 10)|| 1;
   const limit = parseInt(req.query.limit, 10)||25;
   const startIndex = (page-1)*limit;
   const endIndex = page*limit;

   const total = await Bootcamp.countDocuments();

   query = query.skip(startIndex).limit(limit)

    //Executing query

        const bootcamp = await query;

    //pagination result

    const pagination = {};

    if(endIndex < total){
        pagination.next = {
            page:page + 1,
            limit
        }
    }

    if(startIndex>0){
        pagination.prev = {
            page:page-1,
            limit
        }
    }

        res.status(200).json({

            success: true,

            pagination:pagination,

            count:bootcamp.length,

            data: bootcamp

        })

    });


//@desc   Get a single bootcamp
//@route Get api/bootcamps/v1/:id
//@access public
exports.getBootCamp =asyncHandler(async (req, res, next) => {

        const bootcamp = await Bootcamp.findById(req.params.id);

        if(!bootcamp){
           return next(
               new ErrorResponse(`Bootcamp with id ${req.params.id} not found`, 404)
           )
        }
            res.status(200).json({
                success: true,
                 data: bootcamp
                });
        
  
    } )


//@desc   Create a bootcamp
//@route Get api/bootcamps/v1
//@access private
exports.createBootCamp =asyncHandler(async (req, res, next)=> {
    
    const bootcamp = await Bootcamp.create(req.body);
   return res.status(201).json({
        success: true,
        data: bootcamp
        })
   
});

//@desc   update
//@route update api/bootcamps/v1
//@access privates
exports.updateBootCamp =  asyncHandler(async(req, res, next) => {
    
        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators:true
        });
        res.status(200).json({
            success: true, 
            data: bootcamp
        })

        if(!bootcamp){
            return next(new ErrorResponse(`Bootcamp with id ${req.params.id} not found`, 404)
            );
       }    
    });

//@desc   delete bootcamps
//@route delete api/bootcamps/v1
//@access private
exports.deleteBootCamp = asyncHandler( async (req, res, next) => {
        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)
        if(!bootcamp){
           return next(new ErrorResponse(`Bootcamp with id ${req.params.id} not found`, 404)
           );
            
        }
        res.status(200).json({
            success: true,
             data: {}
             })
        
    
});

//@desc   Get Bootcamp within a radius
//@route delete api/bootcamps/v1/radius/:zipcode/:distance
//@access private
exports.getBootCampInRadius = asyncHandler( async (req, res, next) => {
   const { zipcode, distance } = req.params;

   //get latitude and longitude from geocoder
   const loc = await geocoder.geocode(zipcode);
   const lat = loc[0].latitude;
   const lng =  loc[0].longitude;

   //Calc radius using radius 
   //Divide distance by radius of the earth
   //Earth radius 3,963 mi / 6,378 km
   const radius = distance / 3963;
   const bootcamp = await Bootcamp.find({
    
        location : {
           $geoWithin: { $centerSphere: [ [ lng, lat ], radius ] }
        }
   });
     res.status(200).json({
         success: true,
         count:bootcamp.length,
         data: bootcamp
      })   

});
//@desc   Upload a photo
//@route to upload  api/bootcamps/v1/:bootcampId/photo
//@access private
exports.bootCampUploadPhoto = asyncHandler( async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)
    if(!bootcamp){
       return next(new ErrorResponse(`Bootcamp with id ${req.params.id} not found`, 404)
       );
        
    }

    if(!req.file){
        return next(new ErrorResponse(`please upload a photo`, 404)
       );
    }
    res.status(200).json({
        success: true,
         data: {}
         })
    

});