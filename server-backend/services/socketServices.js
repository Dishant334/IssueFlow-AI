import { Server } from "socket.io";  // taking Server from socket.io
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { Task } from "../models/Tasks.js";
import Workspace from "../models/Workspace.js";
import Project from "../models/Projects.js";
import { limiters } from "./rateLimiters.js";
import { socketIp } from "../utils/clientIp.js";

let io;  //initializing a instance of Socket.io

// the room of a task. The prefix keeps the names apart from other kinds of rooms ("user:...", and later "project:...")
const taskRoom = (taskId) => `task:${taskId}`

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

// too many new connections from one ip
io.use(async (socket,next)=>{
  try{
    const result = await limiters.socketConnectPerIp.consume(socketIp(socket))
    if(!result.allowed) return next(new Error("Too many connections"))
  }catch(err){
    console.error("socket rate limit error, connection allowed:",err.message)
  }
  next()
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

  // a room for this user alone: lets the server find all his sockets (used when he loses access to something)
  socket.join(`user:${socket.data.userId}`)

  //join task room, only if the user is allowed to open that task
  socket.on('joinTask',async (taskId)=>{   // task act as a room
    try{
      // every join does database lookups, so one socket cannot join without limit
      if(!(await limiters.socketJoinPerSocket.consume(socket.id)).allowed) return
      if(!mongoose.isValidObjectId(taskId)) return
      if(await canOpenTask(socket.data.userId,taskId)) socket.join(taskRoom(taskId))
    }catch(err){
      console.error("joinTask failed:",err.message)
    }
  })

  socket.on('leaveTask',(taskId)=>{
    if(typeof taskId==='string') socket.leave(taskRoom(taskId))
  })
})
return io
}

export const  getio =()=>{
    if(!io) throw new Error('Socket not initialized')
        return io
}

// send an event to everybody who has this task open
export const emitToTask = (taskId, event, payload) => {
  getio().to(taskRoom(taskId)).emit(event, payload)
}

// Access is checked when a socket joins a room, so when somebody loses access (removed from a workspace or a project)
// the rooms he already joined must be checked again: he leaves the ones he may not see anymore, and keeps the others.
export const recheckUserRooms = async (userId) => {
  if (!io) return
  try {
    const sockets = await io.in(`user:${userId}`).fetchSockets()
    for (const socket of sockets) {
      for (const room of socket.rooms) {
        if (!room.startsWith("task:")) continue
        if (!(await canOpenTask(userId, room.slice(5)))) socket.leave(room)
      }
    }
  } catch (err) {
    console.error("recheckUserRooms failed:", err.message)
  }
}
