import express from 'express'
import protect from '../authMiddleWare/protect.js'
import { generateDescription, suggestPriority, summarizeComments } from '../controllers/aiController.js'

const aiRoute=express.Router()

aiRoute.post('/generate-description',generateDescription)
aiRoute.post('/suggest-priority',protect,suggestPriority)
aiRoute.post('/summarize-comments',protect,summarizeComments)

export default aiRoute