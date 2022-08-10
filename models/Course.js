const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title:{
        type:String,
        trim:true,
        require:[true, 'Please add a course title']
    },

    description:{
        type:String,
        require:[true, 'Please add description']
    },
    weeks:{
        type:String,
        require:[true, 'Please add number of weeks']
    },
    tuition:{
        type:Number,
        require:[true, 'Please add tuition']
    },
    minimumSkills:{
        type:String,
        require:[true, 'Please add minimum skill'],
        enum:['beginner', 'intermediate', 'advance']
    },
    description:{
        type:String,
        require:[true, 'Please add description']
    },
    scholarshipAvailabe:{
        type:Boolean,
        default: false
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        require:true
    }
});

//static method to get averagecost of course
courseSchema.statics.getAverageCost = async function(bootcampId){
    console.log('Calculating avg cost...'.blue)

    const obj = await this.aggregate([
        {
            $match: {bootcamp:bootcampId}
        },
        {
            $group:{
                _id:'$bootcamp',
                averageCost:{ $avg:'$tuition'}
            }
            
        }
    ])
    console.log(obj)
    try{
     await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
         averageCost: Math.ceil(obj[0].averageCost/10)*10
     });
    }
    catch(err){
        next(error)
    }

}

//call averageCost after save
courseSchema.post('save', function(){
    this.constructor.getAverageCost(this.bootcamp);
})

//call averageCost before save
courseSchema.post('remove', function(){
    this.constructor.getAverageCost(this.bootcamp);
})

module.exports= mongoose.model('Course', courseSchema);