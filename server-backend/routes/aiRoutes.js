import express from 'express'
import protect from '../authMiddleWare/protect.js'
import { generateDescription, quota, suggestPriority, summarizeComments } from '../controllers/aiController.js'
import { aiBurstLimit } from '../authMiddleWare/rateLimit.js'

const aiRoute=express.Router()

aiRoute.get('/quota',protect,quota)
aiRoute.post('/generate-description',protect,aiBurstLimit,generateDescription)
aiRoute.post('/suggest-priority',protect,aiBurstLimit,suggestPriority)
aiRoute.post('/summarize-comments',protect,aiBurstLimit,summarizeComments)

export default aiRoute