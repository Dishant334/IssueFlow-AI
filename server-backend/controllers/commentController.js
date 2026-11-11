import mongoose from "mongoose";
import Comment from "../models/Comments.js";
import { getio } from "../services/socketServices.js";
import { sendError } from "../utils/handleError.js";

// the workspace, project and task of the url are already checked by the middleware (req.task)

const createComment =async(req,res)=>{
    try{
   const {userId}=req.user
   const taskId=req.task._id
   const text=req.body.text?.toString().trim()
   if(!text) return res.status(400).json({message:"Please enter a valid comment"})

   const comment= await Comment.create({
        taskId:taskId,
        user:userId,
        text:text,
        isEdited:false,
    })

    //real time change
     const populatedComment = await Comment.findById(comment._id)
     .populate("user", "name")

     const io = getio();
     io.to(taskId.toString()).emit("newComment", populatedComment);

    return res.status(200).json({message:"Comment added successfully",comment})
}catch(err){
    return sendError(res,err)
}
}

const showComments=async(req,res)=>{
    try{
   const taskId=req.task._id
    const page = Math.max(parseInt(req.query.page) || 1, 1)
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 3, 1), 50)   //at most 50 comments at once

    const skip = (page - 1) * limit

  const comments = await Comment.find({ taskId })
      .populate("user", "name")
      .sort({ createdAt: -1 }) // latest first
      .skip(skip)
      .limit(limit) 

    const total = await Comment.countDocuments({ taskId })

return res.status(200).json({
  comments,
  totalPages: Math.ceil(total / limit),
  currentPage: page
})
}catch(err){
    return sendError(res,err)
}
}

// loads the comment of the url, it must be written by this user and belong to this task
const findOwnComment=async(req,res)=>{
   const {userId}=req.user
   const {commentId}=req.params
   if(!mongoose.isValidObjectId(commentId)){
     res.status(400).json({message:"Comment does not exist"})
     return null
   }
   const comment = await Comment.findById(commentId)
   if (!comment){
     res.status(404).json({ message: "Comment not found" })
     return null
   }
   if (comment.user.toString() !== userId.toString()) {
     res.status(403).json({ message: "Not authorized" })
     return null
   }
   if (comment.taskId.toString() !== req.task._id.toString()) {
     res.status(400).json({ message: "Comment not in this task" })
     return null
   }
   return comment
}

const deleteComment=async (req,res)=>{
    try{
    const comment=await findOwnComment(req,res)
    if(!comment) return

    await Comment.findByIdAndDelete(comment._id)

    //real time change
    const io = getio();
   io.to(req.task._id.toString()).emit("deleteComment", comment._id.toString());

    return res.status(200).json({message:"Comment deleted successfully"})
}catch(err){
    return sendError(res,err)
}  
}

const editComment=async(req,res)=>{
   try{
   const editedComment=req.body.editedComment?.toString().trim()
   if(!editedComment) return res.status(400).json({message:"Please type something"})

    const comment=await findOwnComment(req,res)
    if(!comment) return

    comment.text=editedComment
    comment.isEdited=true
    await comment.save()

    //real time change
    const io = getio();
    io.to(req.task._id.toString()).emit("editComment", {
    commentId:comment._id.toString(),
    text: editedComment
    });

    return res.status(200).json({message:"Comment edited successfully"})
   }catch(err){
    return sendError(res,err)
   }
}

export {createComment,showComments,deleteComment,editComment}
