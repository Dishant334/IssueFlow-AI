import mongoose from "mongoose"
import Workspace from "../../models/Workspace.js"

const validateWorkspaceAccess=async(req,res,next)=>{
    const {workspaceid}=req.params
    const {userId}=req.user
    if(!mongoose.isValidObjectId(workspaceid)) return res.status(400).json({message:"Invalid workspace id"})
    const workspace=await Workspace.findById(workspaceid)
    if(!workspace) return res.status(404).json({message:"Workspace not found!"})
    const memberInWorkspace=workspace.members.find((m)=>m.user.toString()===userId.toString())
   if(!memberInWorkspace) return res.status(403).json({message:"Member not in workspace"})
    req.workspace=workspace
    next()
}

export  {validateWorkspaceAccess}
