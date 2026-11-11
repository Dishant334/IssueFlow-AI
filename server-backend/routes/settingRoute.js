import express from 'express'
import protect from '../authMiddleWare/protect.js'
import { writeLimit } from "../authMiddleWare/rateLimit.js";
import { deleteWorkspace, details, leaveWorkspace, updateUser, updateWorkspace } from '../controllers/settingsController.js'

const settingRoute=express.Router()

settingRoute.get('/workspace/:workspaceid/details',protect,details)
settingRoute.patch('/workspace/:workspaceid/settings/user',protect,writeLimit,updateUser)
settingRoute.patch('/workspace/:workspaceid/settings/workspace',protect,writeLimit,updateWorkspace)
settingRoute.delete('/workspace/:workspaceid/me',protect,writeLimit,leaveWorkspace)
settingRoute.delete('/workspace/:workspaceid/remove',protect,writeLimit,deleteWorkspace)

export default settingRoute