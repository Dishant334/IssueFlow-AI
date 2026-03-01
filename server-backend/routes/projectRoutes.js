import express from "express";
import { addMembers, createProject, deleteMember, deleteProject, getAllProjects, getproject, updateProject, updateRole } from "../controllers/projectController.js";
import protect from "../authMiddleWare/protect.js";
import Archived from "../authMiddleWare/project/isProjectArchived.js";

const projectRouter= express.Router()

projectRouter.get('/projects/:projectId',protect,getproject)  // To get single project
projectRouter.post('/workspace/:workspaceid/projects',protect,createProject) // To create new project
projectRouter.post('/projects/:projectId/members',protect,Archived,addMembers) //To add new member
projectRouter.patch('/projects/:projectId/members/:memberId',protect,Archived,updateRole)  //To update role
projectRouter.delete('/projects/:projectId/members/:membrId',protect,Archived,deleteMember)  // To delete a member
projectRouter.get('/workspace/:workspaceid/project',protect,getAllProjects)  //To get all projects
projectRouter.patch('/projects/:projectId',protect,Archived,updateProject)  // To change name or description
projectRouter.delete('/projects/:projectId',protect,deleteProject)
export default projectRouter