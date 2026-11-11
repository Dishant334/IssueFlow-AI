import express from "express";
import protect from "../authMiddleWare/protect.js";
import { writeLimit } from "../authMiddleWare/rateLimit.js";
import { validateProjectAccess } from "../authMiddleWare/tasks/validateProjectAccess.js";
import { validateWorkspaceAccess } from "../authMiddleWare/tasks/validateWorkspaceAccess.js";
import projectNotArchived from "../authMiddleWare/project/projectNotArchived.js";
import { createTask, deleteTask, getAllTasksInProject, getMyTasks, getSingleTaskDetails, moveTask, updateTask,moveTaskWorkspace } from "../controllers/tasksController.js";

const taskRoute=express.Router()

taskRoute.post('/workspace/:workspaceid/projects/:projectId/tasks',protect,writeLimit,validateWorkspaceAccess,validateProjectAccess,projectNotArchived,createTask)
taskRoute.get('/workspace/:workspaceid/projects/:projectId/tasks',protect,validateWorkspaceAccess,validateProjectAccess,getAllTasksInProject)
taskRoute.get('/workspace/:workspaceid/projects/:projectId/tasks/:taskId',protect,validateWorkspaceAccess,validateProjectAccess,getSingleTaskDetails)
taskRoute.patch('/workspace/:workspaceid/projects/:projectId/tasks/:taskId',protect,writeLimit,validateWorkspaceAccess,validateProjectAccess,projectNotArchived,updateTask)
taskRoute.delete('/workspace/:workspaceid/projects/:projectId/tasks/:taskId',protect,writeLimit,validateWorkspaceAccess,validateProjectAccess,projectNotArchived,deleteTask)
taskRoute.patch('/workspace/:workspaceid/projects/:projectId/tasks/:taskId/move',protect,writeLimit,validateWorkspaceAccess,validateProjectAccess,projectNotArchived,moveTask)
taskRoute.get('/workspace/:workspaceid/tasks',protect,validateWorkspaceAccess,getMyTasks)
taskRoute.patch("/workspace/:workspaceid/tasks/:taskId/move",protect,writeLimit,validateWorkspaceAccess,moveTaskWorkspace);

export default taskRoute