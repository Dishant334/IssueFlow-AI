// One time cleanup of data that was left behind before projects, tasks and workspaces were deleted together:
//   - tasks whose project (or workspace) no longer exists
//   - comments whose task no longer exists
//   - invitations whose workspace no longer exists
//
//   node scripts/cleanOrphans.js            only counts what would be removed (nothing is deleted)
//   node scripts/cleanOrphans.js --apply    really deletes it
import "dotenv/config"
import mongoose from "mongoose"
import Project from "../models/Projects.js"
import Workspace from "../models/Workspace.js"
import { Task } from "../models/Tasks.js"
import Comment from "../models/Comments.js"
import Invitation from "../models/Invitation.js"

const apply = process.argv.includes("--apply")

await mongoose.connect(process.env.MONGO_URI)

const workspaceIds = await Workspace.find().distinct("_id")
const projectIds = await Project.find().distinct("_id")

// 1. tasks without a project or workspace
const orphanTaskFilter = { $or: [{ project: { $nin: projectIds } }, { workspace: { $nin: workspaceIds } }] }
const orphanTasks = await Task.countDocuments(orphanTaskFilter)

// 2. comments without a task (counted after the tasks above are gone, so the real task ids are used)
const orphanTaskIds = await Task.find(orphanTaskFilter).distinct("_id")
const liveTaskIds = (await Task.find({ _id: { $nin: orphanTaskIds } }).distinct("_id"))
const orphanComments = await Comment.countDocuments({ taskId: { $nin: liveTaskIds } })

// 3. invitations without a workspace
const orphanInvites = await Invitation.countDocuments({ workspaceId: { $nin: workspaceIds } })

console.log(apply ? "Deleting:" : "Dry run (nothing is deleted). Would delete:")
console.log(`  tasks without a project or workspace: ${orphanTasks}`)
console.log(`  comments without a task:              ${orphanComments}`)
console.log(`  invitations without a workspace:      ${orphanInvites}`)

if (apply) {
  await Comment.deleteMany({ taskId: { $nin: liveTaskIds } })
  await Task.deleteMany(orphanTaskFilter)
  await Invitation.deleteMany({ workspaceId: { $nin: workspaceIds } })
  console.log("Done.")
} else {
  console.log("Run again with --apply to delete them.")
}

await mongoose.disconnect()
