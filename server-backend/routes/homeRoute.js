import express from 'express'
import protect from '../authMiddleWare/protect.js'
import { validateWorkspaceAccess } from '../authMiddleWare/tasks/validateWorkspaceAccess.js'
import { home } from '../controllers/homeController.js'

const homeRoute=express.Router()

homeRoute.get('/workspace/:workspaceid/home',protect,validateWorkspaceAccess,home)

export default homeRoute