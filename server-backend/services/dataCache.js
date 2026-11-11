import Workspace from "../models/Workspace.js"
import Project from "../models/Projects.js"
import { bump, keyOf, remember } from "../utils/cache.js"

// What is cached, how long, and what clears it. The groups (the "ws:..." names) are the versions of utils/cache.js.
//
//   ws:<workspaceId>       members and roles of a workspace, its projects and their members
//   tasks:<projectId>      the tasks of one project
//   wstasks:<workspaceId>  the tasks of a whole workspace (used by "My Tasks")
//   memberships            who is in which workspace, and the workspace names (one version for everybody, it changes rarely)
//   user:<userId>          the name and email of a user

// ---------- reads: the same two lookups were made by almost every request (is this person in the workspace / project?)
// .lean() = plain objects. They are only READ by the code that uses them, so they can be shared.
export const getWorkspaceDoc = (workspaceId) =>
  remember(keyOf([`ws:${workspaceId}`], "doc"), 60, () => Workspace.findById(workspaceId).lean())

export const getProjectDoc = (workspaceId, projectId) =>
  remember(keyOf([`ws:${workspaceId}`], `project:${projectId}`), 60, () => Project.findById(projectId).lean())

// ---------- something changed: call the one that tells what happened, right after the change is saved
export const workspaceChanged = (workspaceId) => bump(`ws:${workspaceId}`, "memberships")   // members, roles, name, deleted
export const projectChanged = (workspaceId) => bump(`ws:${workspaceId}`)                      // project created / edited / archived / deleted, its members
export const tasksChanged = (workspaceId, projectId) => bump(`tasks:${projectId}`, `wstasks:${workspaceId}`)
export const userChanged = (userId) => bump(`user:${userId}`)                                // the user changed his name
