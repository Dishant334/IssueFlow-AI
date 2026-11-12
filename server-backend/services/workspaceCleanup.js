import Project from "../models/Projects.js"
import { Task } from "../models/Tasks.js"
import Comment from "../models/Comments.js"
import Invitation from "../models/Invitation.js"
import { recheckUserRooms } from "./socketServices.js"

// someone left (or was removed from) a workspace: he is taken out of its projects and his tasks become unassigned
export const removeUserFromWorkspaceData = async (workspaceId, userId) => {
    await Project.updateMany({ workspaceId }, { $pull: { members: { user: userId } } })
    await Task.updateMany({ workspace: workspaceId, assignedTo: userId }, { $unset: { assignedTo: 1 } })
    await recheckUserRooms(userId)   // his open sockets must stop getting live comments of this workspace
}

// a workspace is deleted: everything inside it goes too (children first, so a failure in between can be tried again)
export const deleteWorkspaceData = async (workspaceId) => {
    const taskIds = await Task.find({ workspace: workspaceId }).distinct("_id")
    await Comment.deleteMany({ taskId: { $in: taskIds } })
    await Task.deleteMany({ workspace: workspaceId })
    await Project.deleteMany({ workspaceId })
    await Invitation.deleteMany({ workspaceId })
}
