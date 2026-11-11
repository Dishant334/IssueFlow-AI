import express from 'express'
import { addWorkspace, getSingleWorkspace, getWorkspaces } from '../controllers/workspaceController.js'
import protect from '../authMiddleWare/protect.js'
import { writeLimit } from "../authMiddleWare/rateLimit.js";

const workspaceRouter=express.Router()
workspaceRouter.post("/workspace",protect,writeLimit, addWorkspace)
workspaceRouter.get('/workspaces',protect,getWorkspaces)
workspaceRouter.get('/workspace/:workspaceid',protect,getSingleWorkspace)

export default workspaceRouter