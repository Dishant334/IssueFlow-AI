import express from 'express'
import protect from '../authMiddleWare/protect.js'
import { validateWorkspaceAccess } from '../authMiddleWare/tasks/validateWorkspaceAccess.js'
import { validateProjectAccess } from '../authMiddleWare/tasks/validateProjectAccess.js'
import { createComment, deleteComment, editComment, showComments } from '../controllers/commentController.js'

const commentRoute=express.Router()

commentRoute.post('/workspace/:workspaceid/project/:projectId/task/:taskId/comments',protect,validateWorkspaceAccess,validateProjectAccess,createComment)
commentRoute.get('/workspace/:workspaceid/project/:projectId/task/:taskId/comments',protect,validateWorkspaceAccess,validateProjectAccess,showComments)
commentRoute.delete('/workspace/:workspaceid/project/:projectId/task/:taskId/comments/:commentId/delete',protect,validateWorkspaceAccess,validateProjectAccess,deleteComment)
commentRoute.patch('/workspace/:workspaceid/project/:projectId/task/:taskId/comments/:commentId/edit',protect,validateWorkspaceAccess,validateProjectAccess,editComment)

export default commentRoute