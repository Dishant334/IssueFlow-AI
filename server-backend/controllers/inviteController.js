import Invitation from "../models/Invitation";
import Workspace from "../models/Workspace";
import {v4 as uuidv4} from 'uuid'
import crypto from "crypto";
import User from "../models/User";


 // : POST /api/workspace/:workspaceid/invite
 const invite= async (req,res)=>{
    try{
    const {userId}=req.user
    const {workspaceid}=req.params     /**1. extract workspace id from params */
    const {email} = req.body  /**2.get email from cliend body*/

     if(!email) return res.status(400).json({message:"Enter Email"})
    const normalizeEmail= email.toLowerCase().trim()   /**3.normalize email to lowercase and trim it */
      

      const workspace = await Workspace.findById(workspaceid);
      if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
      }
      
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
            workspaceId: workspaceid,
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
        workspaceId:workspaceid,
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

    if(invitation.status!='pending') return res.status(400).json({message:"Invite already exists"})

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
 }

 export {invite,accept}