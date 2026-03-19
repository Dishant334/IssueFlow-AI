import Project from "../../models/Projects";

const validateProjectAccess=async(req,res,next)=>{
    const {projectId}=req.params
    const workspaceId=req.workspace._id
    const project=await Project.findById(projectId)
    if(!project) return res.status(400).json({message:"Project do not exist"})
    const projectInWorkspace=project.workspaceId.toString()===workspaceId.toString()
   if(!projectInWorkspace) return res.status(400).json({message:"Project Not In Workspace"})
    req.project=project
   next()
}

export {validateProjectAccess}