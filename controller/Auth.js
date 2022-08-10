const ErrorResponse = require('../utils/errorResponse');

const asyncHandler = require('../middleware/async');

const User = require('../models/User');

//@desc   Register users
//@route Get api/v1/auth/register
//@access public

exports.register = asyncHandler(async (req, res, next)=>{
    const {name, email, password, role} = req.body;

    //create users
    const user  = await User.create({
        name,
        email,
        password,
        role
    })

    
    //create token

    const token = user.getSignedJwtToken();

    res.status(200).json({success:true, token});
})
//@desc   Login users
//@route Get api/v1/auth/Login
//@access public

exports.login = asyncHandler(async (req, res, next) => {
    const {email, password} = req.body;

//validate email and matchedPassword

if(!email||!password){
   return next(new ErrorResponse('insert email and password', 400)) ;
}

//check for user
   const user = await User.findOne({email}).select('+password')

    if(!user) {
        return next(new ErrorResponse('invalid credentials', 401))
    }

//check for matches
const isMatch = await user.matchedPassword(password)

if(!isMatch){
    return next(new ErrorResponse('invalid credentials', 401))
}else{
    //create token

    const token = user.getSignedJwtToken();

    res.status(200).json({success:true, token});
}

})
//@desc   get present loggedIn User
//@route Get api/v1/auth/me
//@access private

exports.getMe = asyncHandler(async(req, res, next)=>{
    const user = await User.findById(req.user.id)
    res.status(200).json({
        success:true,
        data:user
    })
})