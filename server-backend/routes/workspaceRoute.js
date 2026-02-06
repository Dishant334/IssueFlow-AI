import express from 'express'
import { addWorkspace, getSingleWorkspace, getWorkspaces } from '../controllers/workspaceController.js'

const workspaceRouter=express.Router()
workspaceRouter.post("/workspace", addWorkspace)
workspaceRouter.get('/workspaces',getWorkspaces)
workspaceRouter.get('/workspace/:workspaceid',getSingleWorkspace)

export default workspaceRouter