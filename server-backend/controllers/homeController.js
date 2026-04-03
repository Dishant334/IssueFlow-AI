import Project from "../models/Projects.js";
import { Task } from "../models/Tasks.js";

const home = async (req, res) => {
  try {
    const { userId } = req.user;
    const { workspaceid } = req.params;

    if (!workspaceid) {
      return res.status(400).json({ message: "Workspace not provided" });
    }

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
      Project.countDocuments({ workspaceId: workspaceid }),
      Task.countDocuments({ workspace: workspaceid }),
      Task.countDocuments({workspace:workspaceid,assignedTo:userId}),
      Task.countDocuments({ workspace: workspaceid,assignedTo:userId ,status: "done" }),

      // My tasks (limit 3)
      Task.find({ workspace: workspaceid, assignedTo: userId })
        .sort({ createdAt: -1 })
        .limit(3)
        .populate("assignedTo", "name")
        .populate("createdBy", "name"),

      // Recent projects (limit 2)
      Project.find({ workspaceId: workspaceid })
        .sort({ createdAt: -1 })
        .limit(2)
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
    return res.status(500).json({
      message: "Failed to fetch dashboard",
      error: err.message,
    });
  }
};

export { home };