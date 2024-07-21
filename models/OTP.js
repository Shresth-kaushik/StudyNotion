const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");

const OTPSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    otp:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        exipres:5*60,
    }
});


// here we write a function -> to send the email 
async function sendVerificationEmail(email , otp) {
    try{
        const mailResponse = await mailSender(email , "Verification Email from the SmartLearn " , otp);
        console.log("Email send successfully " ,mailResponse);
    }
    catch(error){
        console.log("Error while sending the email " , error);
        throw error;
    }
}

OTPSchema.pre("save" , async function(next){
    await sendVerificationEmail(this.email , this.otp);
    next();
});

module.exports = mongoose.model("OTP", OTPSchema);