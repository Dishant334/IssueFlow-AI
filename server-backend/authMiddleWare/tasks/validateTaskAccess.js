import mongoose from "mongoose"
import { Task } from "../../models/Tasks.js"

// loads the task of the url and makes sure it belongs to this workspace and project (used by the comment routes)
const validateTaskAccess=async(req,res,next)=>{
    const {taskId}=req.params
    if(!mongoose.isValidObjectId(taskId)) return res.status(400).json({message:"TaskId is wrong"})
    const task=await Task.findById(taskId)
    if(!task) return res.status(404).json({message:"Task does not exist"})
    if(task.workspace.toString()!==req.workspace._id.toString()) return res.status(400).json({message:"Task not in workspace"})
    if(task.project.toString()!==req.project._id.toString()) return res.status(400).json({message:"Task not in project"})
    req.task=task
    next()
}

export {validateTaskAccess}
