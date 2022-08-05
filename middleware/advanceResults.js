const advanceResult = (model, populate)=> async (req, res, next)=>{
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
          query = model.find(JSON.parse(queryStr))

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
   const total = await model.countDocuments(); 
   query = query.skip(startIndex).limit(limit)

if(populate){
    query = query.populate(populate);
}

    //Executing query

        const result = await query;

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

            count:result.length,

            data: result

        });
}

module.exports = advanceResult;