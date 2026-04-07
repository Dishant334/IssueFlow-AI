import Workspace from '../models/Workspace.js'
import User from '../models/User.js'

const details =async (req,res)=>{
    try{
    const {userId}=req.user
    const {workspaceid}=req.params
     
    const user=await User.findById(userId)
    if(!user) return res.status(401).json({message:'User Not Found.Please Signup to continue'})

     const username=user.name
     const email=user.email
     
     const workspace=await Workspace.findById(workspaceid).populate('createdBy','name')
     if(!workspace) return res.status(401).json({message:"Workspace not found"})

    const workspacename=workspace.name
    const workspacecreating=workspace.createdBy.name
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
    return res.status(500).json({message:"Something Went Wrong"})
}
}

const updateUser=async (req,res)=>{
    try{
    const {userId}=req.user
    const {updateName}=req.body
    const newName=updateName?.trim()
    if(!newName) return res.status(401).json({message:"Please Write a valid username"})
    const user=await User.findById(userId)
    if(!user) return res.status(401).json({message:"User not found"})
    const name=user.name
    
    if(name ===newName)   return res.status(200).json({message:"No changes made"})

    await User.findByIdAndUpdate(userId,{name:newName})
    return res.status(200).json({message:"UserName Updated Successfully"})
    }catch(err){
    return res.status(500).json({message:"Something Went Wrong"})
    }
}

const updateWorkspace=async(req,res)=>{
    try{
    const {userId}=req.user
    const {workspaceid}=req.params

    const {workspaceName}=req.body

    const newWorkspaceName=workspaceName.trim()
    if(!newWorkspaceName) return res.status(401).json({message:"Please Enter a valid workspace name"})
     
     const workspace=await Workspace.findById(workspaceid)
     if(!workspace) return res.status(400).json({message:"Workspace not found"})
    
     if(workspace.name===newWorkspaceName) return res.status(200).json({message:"No changes made"})

     const member=workspace.members.find((m=>m.user.toString()===userId.toString()))
     if(!member) return res.status(400).json({message:"You are not a member of workspace"})
     if(member.role!='admin') return res.status(409).json({message:"You are not authorised to update the name"})

     await Workspace.findByIdAndUpdate(workspaceid,{name:workspaceName})
     return res.status(200).json({message:"Workspace name updated successfully"})
    }catch(err){
    return res.status(500).json({message:"Something Went Wrong"})
    }
}
    const leaveWorkspace=async(req,res)=>{
        try{
        const {userId}=req.user
        const {workspaceid}=req.params
        const workspace=await Workspace.findById(workspaceid)
        if(!workspace) return res.status(400).json({message:"Workspace not found"})
        
        workspace.members=workspace.members.filter((m)=>m.user.toString()!=userId.toString())

        await workspace.save()
        return res.status(200).json({message:'Left workspace successfully'})
       }catch(err){
         return res.status(500).json({message:"Something went wrong"})
       }
    }

    const deleteWorkspace=async(req,res)=>{
        try{
            const {userId}=req.user
           const {workspaceid}=req.params

         const workspace=await Workspace.findById(workspaceid)
     if(!workspace) return res.status(400).json({message:"Workspace not found"})

     const member=workspace.members.find((m=>m.user.toString()===userId.toString()))
     if(!member) return res.status(400).json({message:"You are not a member of workspace"})
     if(member.role!='admin') return res.status(409).json({message:"You are not authorised to update the name"})
 
        await Workspace.findByIdAndDelete(workspaceid)
        return res.status(200).json({message:"Workspace deleted successfully"})
      }catch(err){
         return res.status(500).json({message:"Something went wrong"})
      }
    }

    export {details,updateUser,updateWorkspace,leaveWorkspace,deleteWorkspace}
    
