import mongoose from "mongoose"
import Project from "../../models/Projects.js";

const Archived=async(req,res,next)=>{
    try{
    const {projectId}=req.params
    if(!mongoose.isValidObjectId(projectId)) return res.status(400).json({message:"Invalid project id"})
    const project=await Project.findById(projectId)

    if(!project) return res.status(404).json({message:"No Project Exists"})

        if(project.status ==='archived') return res.status(409).json({message:"This project is archived, so it cannot be changed"})
        req.project=project
        next()
    }catch(err){
     return res.status(500).json({message:"Something went wrong"})
    }
}

export default Archived
