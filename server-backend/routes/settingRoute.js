import express from 'express'
import protect from '../authMiddleWare/protect.js'
import { deleteWorkspace, details, leaveWorkspace, updateUser, updateWorkspace } from '../controllers/settingsController.js'

const settingRoute=express.Router()

settingRoute.get('/workspace/:workspaceid/details',protect,details)
settingRoute.patch('/workspace/:workspaceid/settings/user',protect,updateUser)
settingRoute.patch('/workspace/:workspaceid/settings/workspace',protect,updateWorkspace)
settingRoute.delete('/workspace/:workspaceid/me',protect,leaveWorkspace)
settingRoute.delete('/workspace/:workspaceid/remove',protect,deleteWorkspace)

export default settingRoute