import express from "express";
import { accept, allmembers, cancelInvite, gettoken, invite, PendingInvite, promoteMember, removeMember } from "../controllers/inviteController.js";
import protect from "../authMiddleWare/protect.js";
import workspaceAdmin from "../authMiddleWare/workspaceAdmin.js";

const inviteRouter= express.Router()

inviteRouter.post(`/workspace/:workspaceid/invite`,protect,workspaceAdmin,invite)
inviteRouter.post('/invite/accept/:token',protect,accept)
inviteRouter.get('/workspace/:workspaceid/members',protect,allmembers)
inviteRouter.get('/workspace/:workspaceid/invites',protect,workspaceAdmin,PendingInvite)
inviteRouter.delete('/workspace/:workspaceid/member/:memberId',protect,workspaceAdmin,removeMember)
inviteRouter.patch('/workspace/:workspaceid/member/:memberId/promote',protect,workspaceAdmin,promoteMember)
inviteRouter.delete('/workspace/:workspaceid/invite/:inviteId',protect,workspaceAdmin,cancelInvite)
inviteRouter.get('/invite/:token',gettoken)

export {inviteRouter}