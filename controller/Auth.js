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
    res.status(200).json({
        success : true,
        data:user
    })
})
