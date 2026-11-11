import Project from "../models/Projects.js";
import { sendError } from "../utils/handleError.js";
import { Task } from "../models/Tasks.js";

const home = async (req, res) => {
  try {
    const { userId } = req.user;
    const { workspaceid } = req.params;
    const workspace = req.workspace;   // the user is a member, checked by the middleware

    // admins see every project, members only the projects they are part of
    const isAdmin = workspace.members.some(
      (m) => m.user.toString() === userId.toString() && m.role === "admin"
    );
    const visibleFilter = isAdmin
      ? { workspaceId: workspaceid }
      : { workspaceId: workspaceid, "members.user": userId };

    // tasks of deleted projects must not be counted
    const allProjectIds = await Project.find({ workspaceId: workspaceid }).distinct("_id");
    const visibleProjectIds = await Project.find(visibleFilter).distinct("_id");

    // 🔥 Run all queries in parallel
    const [
      totalProjects,
      totalTasks,
      assignedTasks,
      completedTasks,
      myTasks,
      recentProjects
    ] = await Promise.all([
      // Counts
      Project.countDocuments(visibleFilter),
      Task.countDocuments({ project: { $in: visibleProjectIds } }),
      Task.countDocuments({ workspace: workspaceid, assignedTo: userId, project: { $in: allProjectIds } }),
      Task.countDocuments({ workspace: workspaceid, assignedTo: userId, status: "done", project: { $in: allProjectIds } }),

      // My tasks (limit 3)
      Task.find({ workspace: workspaceid, assignedTo: userId, project: { $in: allProjectIds } })
        .sort({ createdAt: -1 })
        .limit(3)
        .populate("assignedTo", "name")
        .populate("createdBy", "name"),

      // Recent projects (limit 2)
      Project.find(visibleFilter)
        .sort({ createdAt: -1 })
        .limit(3)
    ]);

    return res.status(200).json({
      message: "Dashboard fetched successfully",
      dashboard: {
        stats: {
          totalProjects,
          totalTasks,
          completedTasks,
          assignedTasks,
        },
        myTasks,
        recentProjects,
      },
    });

  } catch (err) {
    return sendError(res, err, "Failed to fetch dashboard");
  }
};

export { home };