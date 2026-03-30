import { Task } from "../models/Tasks.js";
import User from "../models/User.js";

//CREATE TASK 
const createTask = async (req, res) => {
  try {
    const { userId } = req.user;
    const user = await User.findById(userId);

    const { title, description, assignedTo, status,priority } = req.body;
    const workspace = req.workspace;
    const project = req.project;

    if (!title) {
      return res.status(400).json({ message: "Please give a valid title" });
    }

    const allowedStatus = ["todo", "in_progress", "done"];
    const finalStatus = status && allowedStatus.includes(status) ? status : "todo";

    const allowedPriority=['low','medium','high']
    const finalPriority=priority && allowedPriority.includes(priority) ? priority:'medium';
    // Validate assignee (only if provided)
    if (assignedTo) {
      const isMember = workspace.members.find(
        (m) => m.user.toString() === assignedTo.toString()
      );
      if (!isMember) {
        return res.status(400).json({ message: "Assignee not in workspace" });
      }
    }

    const lastTask = await Task.findOne({
      project: project._id,
      status: finalStatus,
    }).sort({ position: -1 });

    const newTask = await Task.create({
      title,
      description: description || "",
      createdBy: user._id,
      workspace: workspace._id,
      status: finalStatus,
      project: project._id,
      priority:finalPriority,
      assignedTo,
      position: lastTask ? lastTask.position + 1000 : 1000,
    });

    return res.status(201).json({
      message: "Task created successfully",
      task: newTask,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to create task",
      error: err.message,
    });
  }
};

//  GET PROJECT TASKS
const getAllTasksInProject = async (req, res) => {
  try {
    const project = req.project;

    const tasks = await Task.find({ project: project._id })
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .sort({ status: 1, position: 1 });

    return res.status(200).json({ tasks });
  } catch (err) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

//  GET SINGLE TASK 
const getSingleTaskDetails = async (req, res) => {
  try {
    const { taskId } = req.params;
    const project = req.project;
    const workspace = req.workspace;

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    // Security validation
    if (task.project.toString() !== project._id.toString()) {
      return res.status(403).json({ message: "Invalid project for this task" });
    }

    if (task.workspace.toString() !== workspace._id.toString()) {
      return res.status(403).json({ message: "Invalid workspace for this task" });
    }

    return res.status(200).json({ task });
  } catch (err) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

//UPDATE TASK
const updateTask = async (req, res) => {
  try {
    const { title, description,priority, assignedTo} = req.body;
    const { taskId } = req.params;
    const { userId } = req.user;

    const project = req.project;
    const workspace = req.workspace;

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (task.project.toString() !== project._id.toString())
      return res.status(403).json({ message: "Invalid project" });

    if (task.workspace.toString() !== workspace._id.toString())
      return res.status(403).json({ message: "Invalid workspace" });

    const memberInWorkspace = workspace.members.find(
      (m) => m.user.toString() === userId.toString()
    );

    const memberInProject = project.members.find(
      (m) => m.user.toString() === userId.toString()
    );

    const isCreator = task.createdBy.toString() === userId.toString();
    const isAssignee =
      task.assignedTo &&
      task.assignedTo.toString() === userId.toString();

    const isWorkspaceAdmin = memberInWorkspace?.role === "admin";
    const isProjectAdmin =
      memberInProject && memberInProject.role === "project_admin";

    if (!isWorkspaceAdmin && !isProjectAdmin && !isCreator && !isAssignee) {
      return res.status(403).json({ message: "Not allowed" });
    }

    if (assignedTo) {
      const isMember = workspace.members.find(
        (m) => m.user.toString() === assignedTo.toString()
      );
      if (!isMember) {
        return res.status(400).json({ message: "Assignee not in workspace" });
      }
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (priority !== undefined) updateData.priority = priority;
    if (assignedTo !== undefined) updateData.assignedTo = assignedTo;

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// DELETE TASK 
const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { userId } = req.user;

    const project = req.project;
    const workspace = req.workspace;

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (task.project.toString() !== project._id.toString())
      return res.status(403).json({ message: "Invalid project" });

    if (task.workspace.toString() !== workspace._id.toString())
      return res.status(403).json({ message: "Invalid workspace" });

    const memberInWorkspace = workspace.members.find(
      (m) => m.user.toString() === userId.toString()
    );

    const memberInProject = project.members.find(
      (m) => m.user.toString() === userId.toString()
    );

    const isWorkspaceAdmin = memberInWorkspace?.role === "admin";
    const isProjectAdmin =
      memberInProject && memberInProject.role === "project_admin";

    if (!isWorkspaceAdmin && !isProjectAdmin) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await Task.findByIdAndDelete(taskId);

    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// MOVE TASK 
const moveTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status, position } = req.body;

    const project = req.project;
    const workspace = req.workspace;
    const { userId } = req.user;



    const allowedStatus = ["todo", "in_progress", "done"];
    if (status && !allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    if (position === undefined || typeof position !== "number" || isNaN(position)) {
  return res.status(400).json({ message: "Invalid position" });
}
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (task.project.toString() !== project._id.toString())
      return res.status(403).json({ message: "Invalid project" });

    if (task.workspace.toString() !== workspace._id.toString())
      return res.status(403).json({ message: "Invalid workspace" });

    const memberInWorkspace = workspace.members.find(
      (m) => m.user.toString() === userId.toString()
    );

    const memberInProject = project.members.find(
      (m) => m.user.toString() === userId.toString()
    );

    const isCreator = task.createdBy.toString() === userId.toString();
    const isAssignee =
      task.assignedTo &&
      task.assignedTo.toString() === userId.toString();

    const isWorkspaceAdmin = memberInWorkspace?.role === "admin";
    const isProjectAdmin =
      memberInProject && memberInProject.role === "project_admin";

    if (!isWorkspaceAdmin && !isProjectAdmin && !isCreator && !isAssignee) {
      return res.status(403).json({ message: "Not allowed" });
    }

    if (status) task.status = status;
    task.position = position;

    await task.save();

    return res.status(200).json({
      message: "Task moved successfully",
      task,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to move task",
      error: err.message,
    });
  }
};

// MY TASKS 
const getMyTasks = async (req, res) => {
  try {
    const workspace = req.workspace;
    const { userId } = req.user;

    const tasks = await Task.find({
      workspace: workspace._id,
      assignedTo: userId,
    })
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .sort({ status: 1, position: 1 });

    return res.status(200).json({
      message: "My tasks fetched successfully",
      tasks,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to fetch my tasks",
      error: err.message,
    });
  }
};

export {
  createTask,
  deleteTask,
  updateTask,
  moveTask,
  getAllTasksInProject,
  getSingleTaskDetails,
  getMyTasks,
};