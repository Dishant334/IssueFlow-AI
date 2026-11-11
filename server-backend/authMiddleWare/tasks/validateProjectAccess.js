import mongoose from "mongoose"
import Project from "../../models/Projects.js";

// the project must be in this workspace, and the user must be a member of the project (or a workspace admin)
const validateProjectAccess=async(req,res,next)=>{
    const {projectId}=req.params
    const {userId}=req.user
    const workspace=req.workspace
    if(!mongoose.isValidObjectId(projectId)) return res.status(400).json({message:"Invalid project id"})
    const project=await Project.findById(projectId)
    if(!project) return res.status(404).json({message:"Project do not exist"})
    const projectInWorkspace=project.workspaceId.toString()===workspace._id.toString()
   if(!projectInWorkspace) return res.status(404).json({message:"Project Not In Workspace"})

   const workspaceMember=workspace.members.find(m=>m.user.toString()===userId.toString())
   const projectMember=project.members.find(m=>m.user.toString()===userId.toString())
   if(workspaceMember?.role!=='admin' && !projectMember){
     return res.status(403).json({message:"You are not a member of this project"})
   }
    req.project=project
   next()
}

export {validateProjectAccess}
