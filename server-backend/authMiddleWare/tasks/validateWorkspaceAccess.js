import Workspace from "../../models/Workspace.js"

const validateWorkspaceAccess=async(req,res,next)=>{
    const {workspaceId}=req.params
    const {userId}=req.user
    const workspace=await Workspace.findById(workspaceId)
    if(!workspace) return res.status(400).json({message:"Workspace not found!"})
    const memberInWorkspace=workspace.members.find((m)=>m.user.toString()===userId.toString())
   if(!memberInWorkspace) return res.status(400).json({message:"Member not in workspace"})
    req.workspace=workspace
    next()
}

export  {validateWorkspaceAccess}