const Course = require("../models/Course");
const Tags = require("../models/tags");
const User = require("../models/User");
const {uploadImageToCloudinary} = require("../utils/imageUploader");
require("dotenv").config();


//create course handler function 
exports.createCourse = async (req , res) =>{
    try{
        // fetch the data 
        const {courseName , courseDescription , whatYouWillLearn , price , tag} = req.body;

        //get the thumbnail 
        const thumbnail = req.files.thumbnailImage;

        //validation
        if(!courseName || !courseDescription || !whatYouWillLearn || !price ||!tag || !thumbnail){
            return res.status(400).json({
                success:false,
                message:"All fields are required",
            });
        }
        // check for the instructor 
        const userId = req.user.id;
        const instructorDetails = await User.findById(userId);
        console.log("Instructor Details" , instructorDetails);

        if(!instructorDetails){
            return res.status(404).json({
                success:false ,
                message:"Instructor Details not found ",
            });
        }

        // tag details are valid or not 
        const tagDetails = await Tags.findById(tag); // because in the model we send the tag reference so request mein jo h vo tag id h .

        if(!tagDetails){
            return res.status(404).json({
                success:false ,
                message:"Instructor Details not found ",
            });
        }

        // upload to cloudinary  

        const thumbnailImage = await uploadImageToCloudinary(thumbnail , process.env.FOLDER_NAME) ;

        //ceate an entry for new course .
        const newCourse = await Course.create({
            courseName, 
            courseDescription,
            instructor : instructorDetails._id,
            whatYouWillLearn : whatYoutWillLearn,
            price,
            tag: tagDetails._id,
            thumbnail: thumbnailImage.secure_url,
        });

        // add the new course to the user Schema of Instructor 
        await User.findByIdAndUpdate(
            {
                _id:instructorDetails._id
            },
            {
                $push:{
                    courses: newCourse._id,
                }
            },
            {new:true},
        )

        // Upadate the Tag Schema 
        

        

        //return response 
        return res.status(200).json({
            success:true,
            message:"Course Created successfully ",
            data:newCourse,
        });

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Failed to create course",
            error:error.message,
        });
    }
}


// get all course handler function 
exports.showAllCourses = async (req,res) =>{
    try{
        const allCourses = await Course.find({}, {courseName: true,
            price: true, thumbnail: true, instructor: true, ratingAndReviews: true, studentsEnrolled: true,}).populate("instructor").exec();

            return res.status(200).json({
                success:true,
                message:"Data for the all courses are fetched ",
                data :allCourses,
            });
    }

    catch(error){
        return res.status(500).json({
            success:false ,
            message:"Can not fetch the course data",
            error:error.message,
        });
    }
}
