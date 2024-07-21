const Profile = require("../model/Profile");
const { findById } = require("../models/User");
const User = require("../models/User");


exports.updateProfile = async (req,res) =>{
    try{
        // data input 
    const {dateOfBirth = "" , about="" , contactNumber , gender} = req.body;

    const id = req.user.id;

    // validate the user
    if(!id || !contactNumber || !gender ){
        return res.status(400).json({
            success:false,
            message:"All fields are required",
        });
    }

    // find the profile 
    const userDetails = await User.findById(id);
    const profileId = await userDetails.additionalDetails;
    const profileDetails = await Profile.findById(profileId);

    // update the profile 
    profileDetails.dateOfBirth = dateOfBirth;
    profileDetails.about = about;
    profileDetails.gender = gender;
    profileDetails.contactNumber = contactNumber;
    await profileDetails.save();


    // return response
    return  res.status(200).json({
        success:false ,
        message:"Profile Updated successfully ",
        profileDetails,
    });
    }
    catch(error){
        return res.status(500).json({
            success:false ,
            message:"Unable to update the profile",
        });
    }
}



// delete account 

exports.deleteAccount = async (req,res) =>{
    try{
        // get id 
        const id = req.user.id;

        // validation 
        const userDetails = await User.findById(id);

        if(!userDetails){
            return res.status(404).json({
                success:false ,
                message:"User not found",
            });
        }

        // delete the profile first 
        await Profile.findByIdAndDelete({_id:userDetails.additionalDetails});

        // {HW} : How to unenroll the user from the enrolled courses. 

        // delete the user 
        await User.findByIdAndDelete({_id:id});

        // return response 
        return res.status(200).json({
            success:true,
            message:"User removed successfully ",
        });
    }
    catch(error){
        return res.status(500).json({
            success:false ,
            message:"Unable to delete the profile",
        });
    }
}


// get the user details 

exports.getAllUserDetails = async (req,res) =>{
    try{
        // get the id
        const id = req.user.id;

        // validate the user details
        const userDetails = await User.findById(id).populate("additionalDetails").exec();

        // return response 
        return res.status(200).json({
            success:true,
            message:"User details are excessed succesfully",

        });
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Unable to fetch the user details ",
        });
    }
}
