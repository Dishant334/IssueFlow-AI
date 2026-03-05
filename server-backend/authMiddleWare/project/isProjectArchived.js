import Project from "../../models/Projects.js";

const Archived=async(req,res,next)=>{
    try{
    const {projectId}=req.params
    const project=await Project.findById(projectId)

    if(!project) return res.status(404).json({messgae:"No Project Exists"})

        if(project.status ==='archived') return res.status(409).json({message:"You are not authorized"})
        req.project=project
        next()
    }catch(err){
     return res.status(500).json({message:"Something went wrong"})
    }
}

export default Archived