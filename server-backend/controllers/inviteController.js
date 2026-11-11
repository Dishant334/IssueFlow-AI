import Invitation from "../models/Invitation.js";
import Workspace from "../models/Workspace.js";
import {v4 as uuidv4} from 'uuid'
import crypto from "node:crypto";
import User from "../models/User.js";
import { sendInviteEmail } from "../services/emailServices.js";
import { sendError } from "../utils/handleError.js";
import { removeUserFromWorkspaceData } from "../services/workspaceCleanup.js";



 // : POST /api/workspace/:workspaceid/invite
 const invite= async (req,res)=>{
    try{
    const {userId}=req.user
    const workspace=req.workspace     /**1. extract workspace id from params */
    const {email} = req.body  /**2.get email from cliend body*/

     if(!email || typeof email!=='string') return res.status(400).json({message:"Enter Email"})
    const normalizeEmail= email.toLowerCase().trim()   /**3.normalize email to lowercase and trim it */
      
      const member = workspace.members.find(
      (m) => m.user.toString() === userId);

      if (!member) {
       return res.status(403).json({ message: "You are not a member of this workspace" });
      }

      if (member.role !== "admin") {
    return res.status(403).json({ message: "Only admins can send invites" });
        }

      const user = await User.findOne({ email: normalizeEmail });      
      if (user) {
       const alreadyMember = workspace.members.find(
        (m) => m.user.toString() === user._id.toString()
          );

      if (alreadyMember) {
       return res.status(400).json({ message: "User is already a member" });
       }
         }
      const existingInvite = await Invitation.findOne({
            workspaceId: workspace._id,
            email: normalizeEmail,
             status: "pending"
             });
        if (existingInvite) {
           if (existingInvite.expiresAt < Date.now()) {   //the old invite ran out, it must not block a new one
             existingInvite.status = "expired"
             await existingInvite.save()
           } else {
             return res.status(400).json({ message: "Invite already sent" });
           }
            } 

     const rawToken=uuidv4()    /**hash token */
     
const hashedToken = crypto
  .createHash("sha256")
  .update(rawToken)
  .digest("hex");

    const newInvite = await  Invitation.create({
        workspaceId:workspace._id,
        email:normalizeEmail,
        role:'member',
        invitedBy:userId,
        token:hashedToken,
        status:"pending",
        expiresAt: new Date(Date.now()+7 * 24 * 60 * 60 * 1000)
     })
     const adminUser = await User.findById(userId)
    const inviteLink = `${process.env.CLIENT_URL}/invite/${rawToken}`


    try{
    await  sendInviteEmail({to:normalizeEmail, workspaceName:workspace.name,inviteLink:inviteLink,invitedByName:adminUser.name})
    }catch(mailErr){
      await Invitation.deleteOne({_id:newInvite._id})   //email did not go out, so remove the invite and let the admin try again
      return res.status(502).json({message:"Invite email could not be sent. Please try again"})
    }
     res.status(200).json({message:"Invite Send Successfully"})

    }catch(err){
          if (err.code === 11000) {   /**Duplicate key error*/
      return res.status(400).json({
         message: "Invite already sent"
      });
   }

        return sendError(res,err)
    }
   }
   //:POST /api/invite/accept/:token    raw token
   const accept=async(req,res)=>{
    try{
    const {token}=req.params;
    if(!token) return res.status(400).json({message:"Token not available"})
     const hashedIncoming = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");
   
    const invitation= await Invitation.findOne({ token: hashedIncoming })
    if (!invitation)   return res.status(400).json({message: "Invalid invite"})

    if(invitation.status!='pending') return res.status(400).json({message:"Invite already processed"})

    if(invitation.expiresAt < Date.now()){
        invitation.status = "expired"
          await invitation.save()
    return res.status(400).json({message:"Token expired"})
    }    
    const user = await User.findById(req.user.userId);

        if (!user) {
        return res.status(404).json({ message: "User not found" });
           }

           if (user.email.toLowerCase() !== invitation.email) {
           return res.status(403).json({ message: `This invite is sent to ${invitation.email} Please Login with correct account` });
              }

        
     const workspace = await Workspace.findById(invitation.workspaceId)

      if(!workspace) return res.status(400).json({message:"Workspace Not Found"})
  

      const member = workspace.members.find(
      (m) => m.user.toString() === user._id.toString());

      if (member) {
       return res.status(403).json({ message: "You are already a member of this workspace" });
      }
      
      // take the invite first, so two requests with the same link cannot both use it
      const claimed = await Invitation.findOneAndUpdate({ _id: invitation._id, status: "pending" }, { status: "accepted" })
      if (!claimed) return res.status(400).json({message:"Invite already processed"})

      const added = await Workspace.updateOne(
        { _id: workspace._id, "members.user": { $ne: user._id } },
        { $push: { members: { user: user._id, role: invitation.role === "admin" ? "admin" : "member", joinedAt: new Date() } } }
      )
      if (added.modifiedCount === 0) {
        await Invitation.updateOne({ _id: invitation._id }, { status: "pending" })   //nothing was added, give the invite back
        return res.status(403).json({ message: "You are already a member of this workspace" })
      }

     
 
     return res.status(200).json({message:"Joined Workspace Successfully"})
    }catch(err){
    return sendError(res,err)
  }
   }    
 

 // GET /api/workspace/:workspaceid/members
const allmembers = async(req,res)=>{
  try{
  const {workspaceid}= req.params
  const {userId}=req.user 
  const fullWorkspace=await Workspace.findById(workspaceid).populate("members.user","name email")
  /**{
  "_id": "workspace123",
  "name": "Dev Team",
  "members": [
    {
      "user": "65abc123",   // ObjectId
      "role": "admin",
      "joinedAt": "2026-02-01"
    },
    {
      "user": "65def456",
      "role": "member",
      "joinedAt": "2026-02-03"
    }
  ]
}
  this is returned */
  if(!fullWorkspace){
    return res.status(404).json({message: "workspace not available"})
  }

  const isMember = fullWorkspace.members.some(
   m => m.user._id.toString() === userId
);

if (!isMember) {   //checking if the person trying to access is also a member of this workspace either other people will access it

   return res.status(403).json({ message: "Access denied" });
}

const currentMember = fullWorkspace.members.find(
  m => m.user._id.toString() === userId
);
  return res.status(200).json({
   members: fullWorkspace.members.map(m => ({
      userId: m.user._id,
      name: m.user.name,
      email: m.user.email,
      role: m.role,
      joinedAt: m.joinedAt
   })),
   currentUserRole: currentMember.role
});
  }
  catch(err){
    return sendError(res,err)
  }
 }
  // GET /api/workspace/:workspaceid/invites
 const PendingInvite = async (req,res)=>{
  try{
  
  const {workspaceid}=req.params
  
  await Invitation.updateMany({workspaceId:workspaceid,status:"pending",expiresAt:{$lt:new Date()}},{status:"expired"})
  const invites=await Invitation.find({workspaceId : workspaceid,status:"pending"}).populate('invitedBy','name')
  

  return res.status(200).json({invites})
}catch(err){
    return sendError(res,err)
  }
 } 



 //Delete /api/workspace/:workspaceid/member/:memberId
 const removeMember = async (req, res) => {
   try {
      const { memberId } = req.params;
      const workspace = req.workspace; // attached by middleware

      // Find target member
      const targetMember = workspace.members.find(
         m => m.user.toString() === memberId
      );

      if (!targetMember) {
         return res.status(404).json({
            message: "Member not found in workspace"
         });
      }

      //  Count total admins
      const adminCount = workspace.members.filter(
         m => m.role === "admin"
      ).length;

      //  Prevent removing last admin
      if (targetMember.role === "admin" && adminCount === 1) {
         return res.status(400).json({
            message: "Cannot remove the last admin"
         });
      }

      //  Remove member
      workspace.members = workspace.members.filter(
         m => m.user.toString() !== memberId
      );

      await workspace.save();
      await removeUserFromWorkspaceData(workspace._id, memberId);   //out of the projects, tasks unassigned

      return res.status(200).json({
         message: "Member removed successfully"
      });

   } catch(err){
    return sendError(res,err)
  }
};


// PATCH /api/workspace/:workspaceid/member/:memberId/promote
const promoteMember=async(req,res)=>{
  try{
   const {memberId}=req.params
   const workspace=req.workspace
   if(!workspace) return res.status(404).json({message:"No workspace selected"})

     const targetMember = workspace.members.find(
         m => m.user.toString() === memberId
      );

      if(!targetMember) return res.status(404).json({message:"Member does not exist"})
      if(targetMember.role==='admin') return res.status(200).json({message:"Already a admin"})  

     targetMember.role="admin"
  
    await workspace.save()
     return res.status(200).json({message:"Promote Successful"})
    }catch(err){
    return sendError(res,err)
  }
}


// DELETE /api/workspace/:workspaceId/invite/:inviteId
const cancelInvite = async (req, res) => {
   try {
      const { inviteId } = req.params;
      const workspace = req.workspace; // attached by middleware

      //  Find invite belonging to this workspace
      const invite = await Invitation.findOne({
         _id: inviteId,
         workspaceId: workspace._id
      });

      if (!invite) {
         return res.status(404).json({
            message: "Invite not found"
         });
      }

      //  Only pending invites can be cancelled
      if (invite.status !== "pending") {
         return res.status(400).json({
            message: "Invite cannot be cancelled"
         });
      }

      //  Update status instead of deleting (audit safe)
      invite.status = "cancelled";
      await invite.save();

      return res.status(200).json({
         message: "Invite cancelled successfully"
      });

   } catch(err){
    return sendError(res,err)
  }
};

//: GET /api/invite/:token
const gettoken =async(req,res)=>{
   try{
   const {token}= req.params
   
   if(!token) return res.status(400).json({message:"Token Not available"})
   
    const hashedIncoming = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");
   
    const invitation= await Invitation.findOne({ token: hashedIncoming }).populate("workspaceId","name")
    if (!invitation)   return res.status(400).json({message: "Invalid invite"})
   
      if(invitation.status != 'pending'){
      if(invitation.status=== 'accepted') return res.status(200).json({valid:false,message:"Already Accepted"})
      if(invitation.status==='cancelled') return res.status(400).json({valid:false,message:"Invite Cancelled"})
      if(invitation.status==='expired') return res.status(400).json({valid:false,message:"Invitation Expired"})     
   } 
   
      if(invitation.expiresAt < Date.now()){
      invitation.status = 'expired'
    await  invitation.save()
      return res.status(400).json({message:"Invitation Expired"})
    }

 
   
   return res.status(200).json({message: "Invite is valid", 
      valid:true,
      workspaceId:invitation.workspaceId._id,
      workspaceName : invitation.workspaceId.name,
      inviteemail:invitation.email,
      expiresAt:invitation.expiresAt
   })
}catch(err){
    return sendError(res,err)
  }
}


export {invite,accept,allmembers,PendingInvite,removeMember,promoteMember,cancelInvite,gettoken}