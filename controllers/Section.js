const Section = require("../models/Section");
const Course = require("../models/Course");

exports.createSection = async (req, res) => {
    try{
        // DATA  fetch 
        const {sectionName , courseId} = req.body;
        // data validate 
        if(!sectionName || !courseId){
            return res.status(400).json({
                success:false,
                message:"All fields are required",
            });
        }
        // create section
        const newSection = await Section.create({sectionName});

        // update the section with ObjectId
        const updatedCourseDetails = await Course.findByIdAndDelete(
                                                courseId,
                                                {
                                                    $push:{
                                                        courseContent :newSection._id
                                                    }
                                                },
                                                {new:true},
                    
                                            );

        // USE THE populate function to show the full details of section/subsection ,
        // return response 
        return res.status(200).json({
            success:true,
            message:"Section created successfully",
            updatedCourseDetails ,
        });


    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Unable to create the section ",
            error:error.message,
        })
    }
}



// UPDATE THE  courseSection -----------------------  

exports.updateSection = async (req ,res) =>{
    try{
        // data input 
        const {sectionName , sectionId} = req.body;

        //validate
        if(!sectionName || !sectionId){
            return res.status(404).json({
                success:false,
                message: "Missing properties",
            });
        }

        // update data 
        const section = await Section.findByIdAndUpdate(section , {sectionName} , {new:true});

        // return response
        return res.status(200).json({
            success:true,
            message:"Section updated successfully"
        });

    }

    catch(error){
        return res.status(500).json({
            success:false,
            message:"Unable to create the section ",
            error:error.message,
        })
    }
}


//  DELETE THE SECTION ---------    
exports.deleteSection = async (req ,res) =>{
   try{
     // fetch the id 
     const {sectionId} = req.params ;

     // delete the course with the id 
     await Section.findByIdAndDelete(sectionId);
 
     // return res ;
    return res.status(200).json({
        success:true,
        message:"Section Deleted successfully",
    });
   }catch(error){
    return res.status(500).json({
        success:false ,
        message:"Unable to delete the section ",
        error:error.message,
    });
   }
}



