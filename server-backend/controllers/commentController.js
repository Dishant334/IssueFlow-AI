import Comment from "../models/Comments.js";
import { Task } from "../models/Tasks.js";
import { getio } from "../services/socketServices.js";

const createComment =async(req,res)=>{
    try{        
   const {userId}=req.user
   const workspace=req.workspace
   const project=req.project
   const {taskId}=req.params
   const {text}=req.body
   if(!text) return res.status(400).json({message:"Please enter a valid comment"})

   if(!taskId) return res.status(400).json({message:"TaskId is wrong"})
   const task=await Task.findById(taskId)
   if(!task) return res.status(400).json({message:"Task does not exist"}) 
   const taskInWorkspace=task.workspace.toString() ===workspace._id.toString()
  if(!taskInWorkspace) return res.status(400).json({message:"Task not in workspace"})
   const taskInProject=task.project.toString()===project._id.toString()
  if(!taskInProject) return res.status(400).json({message:"Task not in project"})

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
     io.to(taskId).emit("newComment", populatedComment);

    return res.status(200).json({message:"Comment added successfully",comment})
}catch(err){
    return res.status(500).json({message:"Something went wrong"})
}
}

const showComments=async(req,res)=>{
    try{
       const {userId}=req.user
   const workspace=req.workspace
   const project=req.project
   const {taskId}=req.params
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 3

    const skip = (page - 1) * limit

  

   if(!taskId) return res.status(400).json({message:"TaskId is wrong"})
   const task=await Task.findById(taskId)
   if(!task) return res.status(400).json({message:"Task does not exist"}) 
   const taskInWorkspace=task.workspace.toString() ===workspace._id.toString()
  if(!taskInWorkspace) return res.status(400).json({message:"Task not in workspace"})
   const taskInProject=task.project.toString()===project._id.toString()
  if(!taskInProject) return res.status(400).json({message:"Task not in project"})

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
    return res.status(500).json({message:"Something went wrong"})
}
}

const deleteComment=async (req,res)=>{
    try{
   const {userId}=req.user
   const workspace=req.workspace
   const project=req.project
   const {taskId}=req.params
   const {commentId}=req.params

   if(!commentId) return res.status(400).json({message:"Comment does not exist"})

   if(!taskId) return res.status(400).json({message:"TaskId is wrong"})
   const task=await Task.findById(taskId)
   if(!task) return res.status(400).json({message:"Task does not exist"}) 
   const taskInWorkspace=task.workspace.toString() ===workspace._id.toString()
  if(!taskInWorkspace) return res.status(400).json({message:"Task not in workspace"})
   const taskInProject=task.project.toString()===project._id.toString()
  if(!taskInProject) return res.status(400).json({message:"Task not in project"})

      const comment = await Comment.findById(commentId)
      if (!comment) return res.status(404).json({ message: "Comment not found" })
      if (comment.user.toString() !== userId.toString()) {
       return res.status(403).json({ message: "Not authorized" })
    }
      if (comment.taskId.toString() !== taskId.toString()) {
        return res.status(400).json({ message: "Comment not in this task" })
       }


    await Comment.findByIdAndDelete(commentId)

    //real time change
    const io = getio();
   io.to(taskId).emit("deleteComment", commentId);

    return res.status(201).json({message:"Comment deleted successfully"})
}catch(err){
    return res.status(500).json({message:"Something went wrong"})
}  
}

const editComment=async(req,res)=>{
   try{
      const {userId}=req.user
   const workspace=req.workspace
   const project=req.project
   const {taskId}=req.params
   const {commentId}=req.params
   const {editedComment}=req.body
   if(!editedComment) return res.status(404).json({message:"Please type something"})
     

   if(!commentId) return res.status(400).json({message:"Comment does not exist"})

   if(!taskId) return res.status(400).json({message:"TaskId is wrong"})
   const task=await Task.findById(taskId)
   if(!task) return res.status(400).json({message:"Task does not exist"}) 
   const taskInWorkspace=task.workspace.toString() ===workspace._id.toString()
  if(!taskInWorkspace) return res.status(400).json({message:"Task not in workspace"})
   const taskInProject=task.project.toString()===project._id.toString()
  if(!taskInProject) return res.status(400).json({message:"Task not in project"})

    const comment = await Comment.findById(commentId)

    if (!comment) return res.status(404).json({ message: "Comment not found" })
    if (comment.user.toString() !== userId.toString()) {
    return res.status(403).json({ message: "Not authorized" })
    }
     if (comment.taskId.toString() !== taskId.toString()) {
     return res.status(400).json({ message: "Comment not in this task" })
     }

    

    await Comment.findByIdAndUpdate(commentId,{ text: editedComment, isEdited: true },{ new: true })

    //real time change
    const io = getio();
    io.to(taskId).emit("editComment", {
    commentId,
    text: editedComment
    });

    return res.status(200).json({message:"Comment edited successfully"})
   }catch(err){
    return res.status(500).json({message:"Something went wrong"})
   }
}

export {createComment,showComments,deleteComment,editComment}