const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
require("dotenv").config();


exports.createSubSection = async (req,res) => {
    try{
        // fetch the data 
        const {sectionId,title,description ,timeDuration} = req.body;

        // validate the vedio file 
        const video = req.files.vedioFiles ;

        // validate the data 
        if(!sectionId || !title || !description || !timeDuration || !video){
            return res.status(400).json({
                success:false ,
                message:"All fields are required",
            });
        }
        
        // upload the vedio to the cloudinary -> so that we get the secured url ,
        const uploadDetails = await uploadImageToCloudinary(video , process.env.FOLDER_NAME);

        // create the subsection 
        const subSectionDetails = await SubSection.create({
            title:title,
            timeDuration:timeDuration,
            description:description,
            videoUrl:uploadDetails.secure_url,
        });

        //update the section and return the response ,
        const updatedSubSection = await Section.findByIdAndDelete(
                                                            sectionId,
                                                            {
                                                                $push:{
                                                                    subSection :subSectionDetails._id,
                                                                }
                                                            },
                                                            {new:true},

                                                        );

    
    // {TODO} : Log updated section After adding the populate query 

        return res.status(500).json({
            success:true,
            message:"SubSection ceated successfully",
            updatedSubSection
        });
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"unable to create the subsection",

        });
    }
}

// Update the subsection 
exports.updatedSubSection = async (req,res) =>{
    try{
        // fetch the data
        const {title , description , timeDuration , videoUrl ,subSectionId } = req.body;
        
        //validate the data
        if(!title || !description || !timeDuration || !videoUrl){
            return res.status(404).json({
                success:false,
                message:"All fields are required",
            });
        }

        // update the details ,
        const updatedSubSection = await SubSection.findByIdAndUpdate(
            SubSection._id,
            {
              title,
              timeDuration,
              description,
              videoUrl
            },
            { new: true }
        );
        const updatedSection = await Section.findById(SubSection.section).populate("subSections");

        // return response
        res.status(200).json({
            success: true,
            data: updatedSection,
          });
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"unable to upadate the sub section "
        });
    }
}

// Delete subsection
exports.deleteSubSection = async (req,res) =>{
    try{
        // fetch the id 
        const {subSectionId} = req.body.subSectionId;

        // delete the subsection 
        await SubSection.findByIdAndDelete(subSectionId);

        //return 
        res.status(200).json({
        success:true,
        message:"Sub Section Deleted successfully",
        });
      }catch(error){
        return res.status(500).json({
            success:false,
            message:"unable to delete the subsection",
        });
    }
}
