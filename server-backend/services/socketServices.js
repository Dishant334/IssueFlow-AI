import { Server } from "socket.io";  // taking Server from socket.io
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { Task } from "../models/Tasks.js";
import Workspace from "../models/Workspace.js";
import Project from "../models/Projects.js";

let io;  //initializing a instance of Socket.io

// same rule as the task routes: a workspace member who is in the project (or a workspace admin)
const canOpenTask = async (userId, taskId) => {
  const task = await Task.findById(taskId);
  if (!task) return false;

  const workspace = await Workspace.findById(task.workspace);
  const workspaceMember = workspace?.members.find((m) => m.user.toString() === userId.toString());
  if (!workspaceMember) return false;
  if (workspaceMember.role === "admin") return true;

  const project = await Project.findById(task.project);
  return !!project?.members.some((m) => m.user.toString() === userId.toString());
};

export const initSocket=(server)=>{
io = new Server(server,{
    cors:{
        origin: process.env.HOST,
        methods:["GET","POST"]
    }
})

// only logged in users can connect (the frontend sends its access token when it connects)
io.use((socket,next)=>{
  try{
    const token = socket.handshake.auth?.token
    if(!token) return next(new Error("Unauthorized"))
    const decoded = jwt.verify(token,process.env.JWT_SECRET)
    socket.data.userId = decoded.userId
    next()
  }catch(err){
    next(new Error("Unauthorized"))
  }
})

io.on('connection',(socket)=>{  //connection event runs when a new user connects

  //join task room, only if the user is allowed to open that task
  socket.on('joinTask',async (taskId)=>{   // task act as a room
    try{
      if(!mongoose.isValidObjectId(taskId)) return
      if(await canOpenTask(socket.data.userId,taskId)) socket.join(taskId.toString())
    }catch(err){
      console.error("joinTask failed:",err.message)
    }
  })

  socket.on('leaveTask',(taskId)=>{
    if(typeof taskId==='string') socket.leave(taskId)
  })
})
return io
}

export const  getio =()=>{
    if(!io) throw new Error('Socket not initialized')
        return io
}
