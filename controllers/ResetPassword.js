const { findOneAndUpdate } = require("../models/OTP");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");

// reset passwordToken
exports.resetPasswordToken = async (req, res) =>{
    try{
        //get email from the request body 

    const {email} = req.body;

    //check user for email || validation for email 
    const user = await User.findOne({email:email});
    if(!user){
        // can'nt find the user then 
        return res.status(401).json({
            success:false ,
            message:"User is not registered with us ",
        })
    }

    // generate token 
    const token = crypto.randomUUID();

    //user update -> by adding the token+expiring time
    const updatedDetails = await findOneAndUpdate(
        {email:email} , 
        {
            token :token,
            resetPasswordExpires:Date.now() + 5*60*1000,

        },
        {new:true})

    //url create 
    const url = `http://localhost:3000/update-password/${token}`;

    // send mail creating the url and return the response 
    await mailSender(email ,"Password Reset Link ", 
                    `Password Reset Link : ${url}`);

    return res.json({
        success:true,
        message:"Email Send Succesfully , Please check the email and reset the password ASAP",
    });
    }

    catch(error){
        console.log(error);
        return res.json({
            success:false,
            message:"Something went wrong , Password is not changed", 
        });
    }
}
 

// resetPassword

exports.resetPassword = async (req,res) => {
    try{
        // data fetch 
    const {password , confirmPasword , token } = req.body;

    //validation 
    if(password !== confirmPasword) {
        return res.json({
            success:false,
            message:"Password is not matching",
        })
    }

    // fetch the user details 
    const userDetails = await User.findOne({token:token});

    if(!userDetails){
        return res.json({
            success:false ,
            message:"Token is invalid",
        });
    }
    // token time check karna h
    if(userDetails.resetPasswordExpires < Date.now() ){
        return res.json({
            success:false,
            message:"Token time is  expired , please regenerate your token ",
        })
    }

    // hash the password
    const hashedPassword = await bcrypt.hash(password ,10);

    //password update
    await User.findOneAndUpdate(
        {token:token},
        {password:hashedPassword},
        {new:true},
    );

    return res.status(200).json({
        success:true,
        message:"Password reset successfully",
    });
    }
    
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Something went wrong while sending reset password mail",
        });
    }
}