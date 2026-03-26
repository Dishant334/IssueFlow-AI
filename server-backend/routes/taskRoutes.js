import express from "express";
import protect from "../authMiddleWare/protect.js";
import { validateProjectAccess } from "../authMiddleWare/tasks/validateProjectAccess.js";
import { validateWorkspaceAccess } from "../authMiddleWare/tasks/validateWorkspaceAccess.js";
import { createTask, deleteTask, getAllTasksInProject, getSingleTaskDetails, moveTask, updateTask } from "../controllers/tasksController.js";

const taskRoute=express.Router()

taskRoute.post(createTask,'/workspace/:workspaceid/projects/:projectId/tasks',protect,validateWorkspaceAccess,validateProjectAccess)
taskRoute.get(getAllTasksInProject,'/workspace/:workspaceid/projects/:projectId/tasks',protect,validateWorkspaceAccess,validateProjectAccess)
taskRoute.get(getSingleTaskDetails,'/workspace/:workspaceid/projects/:projectId/tasks/:taskId',protect,validateWorkspaceAccess,validateProjectAccess)
taskRoute.patch(updateTask,'/workspace/:workspaceid/projects/:projectId/tasks/:taskId',protect,validateWorkspaceAccess,validateProjectAccess)
taskRoute.delete(deleteTask,'/workspace/:workspaceid/projects/:projectId/tasks/:taskId',protect,validateWorkspaceAccess,validateProjectAccess)
taskRoute.post(moveTask,'/workspace/:workspaceid/projects/:projectId/tasks/:taskId',protect,validateWorkspaceAccess,validateProjectAccess)

export default taskRoute