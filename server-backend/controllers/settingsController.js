import Workspace from '../models/Workspace.js'
import User from '../models/User.js'
import { sendError } from '../utils/handleError.js'
import { removeUserFromWorkspaceData, deleteWorkspaceData } from '../services/workspaceCleanup.js'

const details =async (req,res)=>{
    try{
    const {userId}=req.user
    const {workspaceid}=req.params
     
    const user=await User.findById(userId)
    if(!user) return res.status(404).json({message:'User Not Found.Please Signup to continue'})

     const username=user.name
     const email=user.email
     
     const workspace=await Workspace.findById(workspaceid).populate('createdBy','name')
     if(!workspace) return res.status(404).json({message:"Workspace not found"})

     const isMember=workspace.members.some((m)=>m.user.toString()===userId.toString())
     if(!isMember) return res.status(403).json({message:"Not a member of this workspace"})

    const workspacename=workspace.name
    const workspacecreating=workspace.createdBy?.name || 'Unknown'
    const date = new Date(workspace.createdAt).toLocaleDateString();
    const workspacecreatedOn=date
    
    const details={
        username:username,
        email:email,
        workspacename:workspacename,
        workspacecreating:workspacecreating,
        workspacecreatedOn:workspacecreatedOn
    }
    return res.status(200).json({details})
}catch(err){
    return sendError(res,err)
  }
}

const updateUser=async (req,res)=>{
    try{
    const {userId}=req.user
    const {updateName}=req.body
    const newName=updateName?.toString().trim()
    if(!newName) return res.status(400).json({message:"Please Write a valid username"})
    const user=await User.findById(userId)
    if(!user) return res.status(404).json({message:"User not found"})
    const name=user.name
    
    if(name ===newName)   return res.status(200).json({message:"No changes made"})

    await User.findByIdAndUpdate(userId,{name:newName})
    return res.status(200).json({message:"UserName Updated Successfully"})
    }catch(err){
    return sendError(res,err)
  }
}

const updateWorkspace=async(req,res)=>{
    try{
    const {userId}=req.user
    const {workspaceid}=req.params

    const {workspaceName}=req.body

    const newWorkspaceName=workspaceName?.toString().trim()
    if(!newWorkspaceName) return res.status(400).json({message:"Please Enter a valid workspace name"})
     
     const workspace=await Workspace.findById(workspaceid)
     if(!workspace) return res.status(404).json({message:"Workspace not found"})

     const member=workspace.members.find((m=>m.user.toString()===userId.toString()))
     if(!member) return res.status(403).json({message:"You are not a member of workspace"})
     if(member.role!='admin') return res.status(403).json({message:"You are not authorised to update the name"})

     if(workspace.name===newWorkspaceName) return res.status(200).json({message:"No changes made"})

     await Workspace.findByIdAndUpdate(workspaceid,{name:newWorkspaceName})
     return res.status(200).json({message:"Workspace name updated successfully"})
    }catch(err){
    return sendError(res,err)
  }
}
    const leaveWorkspace=async(req,res)=>{
        try{
        const {userId}=req.user
        const {workspaceid}=req.params
       
        const workspace=await Workspace.findById(workspaceid)
        if(!workspace) return res.status(404).json({message:"Workspace not found"})
        const isMember=workspace.members.some((m)=>m.user.toString()===userId.toString())
        if(!isMember) return res.status(403).json({message:"You are not a member of workspace"})
     const admins = workspace.members.filter((m) => m.role === 'admin')

      if (admins.length === 1 && admins[0].user.toString() === userId.toString()) {
       return res.status(400).json({
        message: "You are the last admin. Make another member an admin first, or delete the workspace"
       })
}
        const isLastAdmin = admins.length === 1 && admins[0].user.toString() === userId.toString()
        workspace.members=workspace.members.filter((m)=>m.user.toString()!=userId.toString())
        await workspace.save()
        await removeUserFromWorkspaceData(workspace._id,userId)   //out of the projects, tasks unassigned

        const remainingWorkspaces = await Workspace.find({
          "members.user": userId
            })
        return res.status(200).json({
            message:'Left workspace successfully',
            isLastAdmin:isLastAdmin,
            remainingWorkspaces
        })
       }catch(err){
    return sendError(res,err)
  }
    }

    const deleteWorkspace=async(req,res)=>{
        try{
            const {userId}=req.user
           const {workspaceid}=req.params

         const workspace=await Workspace.findById(workspaceid)
     if(!workspace) return res.status(404).json({message:"Workspace not found"})

     const member=workspace.members.find((m=>m.user.toString()===userId.toString()))
     if(!member) return res.status(403).json({message:"You are not a member of workspace"})
     if(member.role!='admin') return res.status(403).json({message:"You are not authorised to delete this workspace"})
 
        
        await deleteWorkspaceData(workspace._id)   //projects, tasks, comments and invites go with it
        await Workspace.findByIdAndDelete(workspaceid)
        
        const remainingWorkspaces=await Workspace.find({'members.user':userId})
        return res.status(200).json({
            message:"Workspace deleted successfully",
            remainingWorkspaces:remainingWorkspaces
        })
      }catch(err){
    return sendError(res,err)
  }
    }

    export {details,updateUser,updateWorkspace,leaveWorkspace,deleteWorkspace}
    
