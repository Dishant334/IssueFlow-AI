import { Task } from "../models/Tasks";
import User from "../models/User";

// createTask
//Post /api/workspace/workspaceid/project/projectId/task
const createTask=async(req,res)=>{
    try{
    const {userId}=req.user
    const user=await User.findById(userId)
    const {title,description,assignedTo,status}=req.body
    const workspace=req.workspace
    const project=req.project
     
    const lastTask = await Task.findOne({
    project: project._id,
    status: status || 'todo',
    }).sort({ position: -1 });

    const workspaceassigne =workspace.members.find((m)=> m.user.toString()===assignedTo.toString())
    if(!workspaceassigne) return res.status(400).json({message:"Assignee not in workspace"})

    const newTask= await Task.create({
                     title:title,
                    description:description,
                    createdBy:user._id,
                    workspace:workspace._id,
                    status:status || 'todo',
                    project:project._id,
                    assignedTo:assignedTo,
                    position:lastTask?lastTask.position+1000:1000
    })
    return res.status(201).json({
        message:"Task created successfully",
        task:newTask
    })
}catch(err){
    return res.status(500).json({message:"Failed to create task",err:err.message})
}
}
//get all tasks
//GET :/api/workspace/:workspaceid/project/:projectId/tasks
const getAllTasksInProject=async(req,res)=>{
    try{
    const project=req.project
    const tasks = await Task.find({ project: project._id })
    .populate("assignedTo", "name email")
    .populate("createdBy", "name email")
    .sort({ status: 1, position: 1 });
    
    return res.status(200).json({tasks})
    }catch(err){
        return res.status(500).json({message:'Something went wrong'})
    }
}

//GET :/api/workspace/:workspaceid/task
const getAllTasksInWorkspace=async(req,res)=>{
    try{
    const workspace=req.workspace
    const tasks = await Task.find({ workspace: workspace._id })
  .populate("assignedTo", "name email")
  .populate("createdBy", "name email")
  .sort({ project: 1, status: 1, position: 1 });

    return res.status(200).json({tasks})
    }catch(err){
        return res.status(500).json({message:"Something went wrong"})
    }
}
//GET :/api/workspace/:workspaceId/project/:projectId/tasks/:taskId
const getSingleTaskDetails=async(req,res)=>{
    try{
      const {taskId}=req.params
      const task=await Task.findById(taskId)

      return res.status(200).json({task})
    }catch(err){
        return res.status(500).json({message:"Something went wrong"})
    }
}
//PATCH /api/workspace/:workspaceId/projects/:projectId/tasks/:taskId
const updateTask=async(req,res)=>{

}
//DELETE /api/workspace/:workspaceId/projects/:projectId/tasks/:taskId
const deleteTask=async(req,res)=>{

}
//PATCH /api/workspace/:workspaceId/projects/:projectId/tasks/:taskId/move
const moveTask=async(req,res)=>{

}

export default createTask;