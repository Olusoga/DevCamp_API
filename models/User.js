const mongoose = require('mongoose');

const bcrypt = require('bcryptjs');

const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, 'please add a name']
    },
    email: {
        type: String,
        required:[true, 'please add an email'],
        match: [
            /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
            'pls add valid email'
        ]
    },
    role:{
        type:String,
        enum:['user', 'publisher'],
        default:'user'
    },
    password:{
        type:String,
        required:[true, 'Pls add a password'],
        minlength:6,
        select:false
    },
    resetpassword: String,
    resetpasswordExpire: Date,
    createdAt:{
        type:Date,
        default:Date.now
    }
})
//encrypting the password
userSchema.pre('save', async function (next){
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)

});
//get signed jwt and return
userSchema.methods.getSignedJwtToken = function(){
    return jwt.sign({id: this._id}, process.env.JWT_SECRET, {
        expiresIn:process.env.JWT_EXPIRE
    })
}

userSchema.methods.matchedPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
}

module.exports = mongoose.model('User', userSchema);