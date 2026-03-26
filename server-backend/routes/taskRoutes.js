import express from "express";
import protect from "../authMiddleWare/protect.js";
import { validateProjectAccess } from "../authMiddleWare/tasks/validateProjectAccess.js";
import { validateWorkspaceAccess } from "../authMiddleWare/tasks/validateWorkspaceAccess.js";
import { createTask, deleteTask, getAllTasksInProject, getSingleTaskDetails, moveTask, updateTask } from "../controllers/tasksController.js";

const taskRoute=express.Router()

taskRoute.post('/workspace/:workspaceid/projects/:projectId/tasks',protect,validateWorkspaceAccess,validateProjectAccess,createTask)
taskRoute.get('/workspace/:workspaceid/projects/:projectId/tasks',protect,validateWorkspaceAccess,validateProjectAccess,getAllTasksInProject)
taskRoute.get('/workspace/:workspaceid/projects/:projectId/tasks/:taskId',protect,validateWorkspaceAccess,validateProjectAccess,getSingleTaskDetails)
taskRoute.patch('/workspace/:workspaceid/projects/:projectId/tasks/:taskId',protect,validateWorkspaceAccess,validateProjectAccess,updateTask)
taskRoute.delete('/workspace/:workspaceid/projects/:projectId/tasks/:taskId',protect,validateWorkspaceAccess,validateProjectAccess,deleteTask)
taskRoute.post('/workspace/:workspaceid/projects/:projectId/tasks/:taskId',protect,validateWorkspaceAccess,validateProjectAccess,moveTask)

export default taskRoute