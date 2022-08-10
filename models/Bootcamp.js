const mongoose = require('mongoose');
const slugify = require('slugify');
const geocoder = require('../utils/geocode')

const BootcampSchema = new mongoose.Schema({
    name : {
        type: String,
        required: [true, 'please add a name'],
        unique:true,
        trim: true,
        maxlength: [50, 'Name can not be more than 50 characters']
    },
    slug: String,
    description:{
        type: String,
        required: [true, 'please add a description'],
        maxlength: [500, 'Description can not be more than 500 characters']
    },
    website: {
        type: String,
        match:[
           /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
            'Pls use a valid URL with HTTP or HTTPS'
        ]
    },
    phone: {
        type:String,
        maxlength:[20, 'Phone number should not exceed 20 characters']
    },
    email: {
        type: String,
        match: [
            /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
            'pls add valid email'
        ]
    },
    address: {
        type: String,
        required:[false, 'Please add your address']
    },
    
    location:{
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
          },
          coordinates: {
            type: [Number],
            required: false,
            index: '2dsphere', 
            sparse: true
          },
          formattedAddress:String,
          street:String,
          city:String,
          state:String,
          zipcode:String,
          country:String
    
    },
    careers:{
    //array of string
    type: [String],
    required: true, 
    enum: [
        'Web Development',
        'Mobile Development',
        'UI/UX',
        'Data Science',
        'Business',
        'Other'
    ]
    },
    averageRating:{
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [10, 'Rating must not be more than 10']
    },

    averageCost:Number,
    photo: {
        type:String,
        default:'no-photo.jpg'
    },
    housing:{
        type: Boolean,
        default: false
    },
    jobAssistance:{
        type: Boolean,
        default: false
    },
    jobGUarantee:{
        type: Boolean,
        default: false
    },
    acceptGi:{
        type: Boolean,
        default: false
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        require:true
    }
}, {
    toJSON:{ virtuals: true},
    toObject: { virtuals : true }
});

//Create bootcamp slug from the name
BootcampSchema.pre('save', function(next) {
    this.slug = slugify(this.name, {lower: true})
    next();
})


//Geocode and create location field
BootcampSchema.pre('save', async function(next){
    const loc = await geocoder.geocode(this.address);
    this.location = {
          type:'point',
          coordinates: [loc[0].longitude, loc[0].latitude],
          formattedAddress: loc[0].formattedAddress,
          street:loc[0].streetName,
          city:loc[0].city,
          state:loc[0].stateCode,
          zipcode:loc[0].zipcode,
          country:loc[0].countryCode
    }

    //Do not save address in DB

    this.address = undefined;

    next();
})
//Cascade delete courses when a bootcamp is deleted
BootcampSchema.pre('remove', async(next) =>{
    await this.model('Course').deleteMany({bootcamp:'_id'});
    next();
})


// Reverse populate with virtual

BootcampSchema.virtual('courses',{
    ref: 'Course',
    localField:'_id',
    foreignField:'bootcamp',
    justOne:false
})
module.exports = mongoose.model('Bootcamp', BootcampSchema);


