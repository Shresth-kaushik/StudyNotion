const Category = require("../models/category");

//create tag ka handler function 
exports.createCategory = async (req,res) => {
    try{
        //fetch the data from the request body 
        const {name , description}= req.body;

        // validate the data 
        if(!name || !description){
            return res.status(400).json({
                success:false ,
                message:"All fields are required",
            });
        }

        // create the entry in the database 
        const categoryDetails = await Category.create({
            name:name, 
            description:description,
        });
        console.log(categoryDetails);
        
        //retur the response 
        return res.status(200).json({
            success:true,
            message:"category created successfully",
        });
    }
    catch(error){
        return res.status(500).json({
            success:false ,
            message:error.message,
        });
    }
}


// Get all tags 

exports.showAllcategory = async (req,res) =>{
    try{
        const allcategory = await Category.find({},{name:true},{description:true});
        res.status(200).json({
            success:true,
            message:"All categories are shown successfully",
            allTags,
        });
    }
    
    catch(error){
        return res.status(500).json({
            success:false ,
            message:error.message,
        });
    }
}