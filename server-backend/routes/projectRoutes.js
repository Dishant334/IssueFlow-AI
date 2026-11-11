import express from "express";
import { addMembers, createProject, deleteMember, deleteProject, getAllProjects, getproject, updateProject, updateRole,projectdetailUpdate } from "../controllers/projectController.js";
import protect from "../authMiddleWare/protect.js";
import { writeLimit } from "../authMiddleWare/rateLimit.js";
import Archived from "../authMiddleWare/project/isProjectArchived.js";

const projectRouter= express.Router()

projectRouter.get('/projects/:projectId',protect,getproject)  // To get single project
projectRouter.post('/workspace/:workspaceid/projects',protect,writeLimit,createProject) // To create new project
projectRouter.post('/projects/:projectId/members',protect,writeLimit,Archived,addMembers) //To add new member
projectRouter.patch('/projects/:projectId/members/:memberId',protect,writeLimit,Archived,updateRole)  //To update role
projectRouter.delete('/projects/:projectId/members/:memberId',protect,writeLimit,Archived,deleteMember)  // To delete a member
projectRouter.patch('/projects/:projectId/archive',protect,writeLimit,projectdetailUpdate) //to archive the project
projectRouter.get('/workspace/:workspaceid/projects',protect,getAllProjects)  //To get all projects
projectRouter.patch('/projects/:projectId',protect,writeLimit,Archived,updateProject)  // To change name or description
projectRouter.delete('/projects/:projectId',protect,writeLimit,deleteProject)  //to delete a project
export default projectRouter