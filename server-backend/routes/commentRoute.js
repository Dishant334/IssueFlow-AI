import express from 'express'
import protect from '../authMiddleWare/protect.js'
import { validateWorkspaceAccess } from '../authMiddleWare/tasks/validateWorkspaceAccess.js'
import { validateProjectAccess } from '../authMiddleWare/tasks/validateProjectAccess.js'
import { validateTaskAccess } from '../authMiddleWare/tasks/validateTaskAccess.js'
import projectNotArchived from '../authMiddleWare/project/projectNotArchived.js'
import { createComment, deleteComment, editComment, showComments } from '../controllers/commentController.js'

const commentRoute=express.Router()

commentRoute.post('/workspace/:workspaceid/project/:projectId/task/:taskId/comments',protect,validateWorkspaceAccess,validateProjectAccess,validateTaskAccess,projectNotArchived,createComment)
commentRoute.get('/workspace/:workspaceid/project/:projectId/task/:taskId/comments',protect,validateWorkspaceAccess,validateProjectAccess,validateTaskAccess,showComments)
commentRoute.delete('/workspace/:workspaceid/project/:projectId/task/:taskId/comments/:commentId/delete',protect,validateWorkspaceAccess,validateProjectAccess,validateTaskAccess,projectNotArchived,deleteComment)
commentRoute.patch('/workspace/:workspaceid/project/:projectId/task/:taskId/comments/:commentId/edit',protect,validateWorkspaceAccess,validateProjectAccess,validateTaskAccess,projectNotArchived,editComment)

export default commentRoute