import Invitation from "../models/Invitation";
import Workspace from "../models/Workspace";
import {v4 as uuidv4} from 'uuid'
import crypto from "crypto";
import User from "../models/User";



 // : POST /api/workspace/:workspaceid/invite
 const invite= async (req,res)=>{
    try{
    const {userId}=req.user
    const workspace=req.workspace     /**1. extract workspace id from params */
    const {email} = req.body  /**2.get email from cliend body*/

     if(!email) return res.status(400).json({message:"Enter Email"})
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
           return res.status(400).json({ message: "Invite already sent" });
            } 

     const rawToken=uuidv4()    /**hash token */
     
const hashedToken = crypto
  .createHash("sha256")
  .update(rawToken)
  .digest("hex");

    await  Invitation.create({
        workspaceId:workspace._id,
        email:normalizeEmail,
        role:'member',
        invitedBy:userId,
        token:hashedToken,
        status:"pending",
        expiresAt: new Date(Date.now()+7 * 24 * 60 * 60 * 1000)
     })
     res.status(200).json({message:"Invite Send Successfully"})

    }catch(err){
          if (err.code === 11000) {   /**Duplicate key error*/
      return res.status(400).json({
         message: "Invite already sent"
      });
   }

        return res.status(500).json({message:"Something went wrong"})
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

           if (user.email !== invitation.email) {
           return res.status(403).json({ message: "This invite is not for you" });
              }

        
     const workspace = await Workspace.findById(invitation.workspaceId)

      if(!workspace) return res.status(400).json({message:"Workspace Not Found"})
  

      const member = workspace.members.find(
      (m) => m.user.toString() === user._id.toString());

      if (member) {
       return res.status(403).json({ message: "You are already a member of this workspace" });
      }
      
      workspace.members.push({
        user:user._id,
        role:invitation.role,
        joinedAt:new Date()
      })
     await  workspace.save()

     invitation.status = "accepted"
     await invitation.save()
 
     return res.status(200).json({message:"Joined Workspace Successfully"})
    }catch(err){
     return res.status(500).json({message:"Something went wrong"})
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

  return res.status(200).json({
   members: fullWorkspace.members.map(m => ({
      userId: m.user._id,
      name: m.user.name,
      email: m.user.email,
      role: m.role,
      joinedAt: m.joinedAt
   }))
});
  }
  catch(err){
    return res.status(500).json({message:"Something went wrong"})
  }
  
 }
  // GET /api/workspace/:workspaceid/invites
 const PendingInvite = async (req,res)=>{
  try{
  
  const {workspaceid}=req.params
  
  const invites=await Invitation.find({workspaceId : workspaceid,status:"pending"})
  

  return res.status(200).json({invites})
}catch(err){res.status(500).json({message:"Something went wrong"})}
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

      return res.status(200).json({
         message: "Member removed successfully"
      });

   } catch (err) {
      return res.status(500).json({
         message: "Something went wrong"
      });
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
      res.status(500).json({message:"Something Went Wrong"})
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

   } catch (err) {
      return res.status(500).json({
         message: "Something went wrong"
      });
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
   return res.status(500).json({message : "Something Went Wrong"})
}
}


export {invite,accept,allmembers,PendingInvite,removeMember,promoteMember,cancelInvite,gettoken}