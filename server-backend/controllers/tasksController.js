import { Task } from "../models/Tasks.js";
import Project from "../models/Projects.js";
import Comment from "../models/Comments.js";
import { sendError } from "../utils/handleError.js";

const allowedStatus = ["todo", "in_progress", "done"];
const allowedPriority = ["low", "medium", "high"];

// a task can only be given to someone who can open the project: a project member or a workspace admin
const canBeAssigned = (workspace, project, assignedTo) => {
  const id = assignedTo.toString();
  const inProject = project.members.some((m) => m.user.toString() === id);
  const adminInWorkspace = workspace.members.some(
    (m) => m.user.toString() === id && m.role === "admin"
  );
  return inProject || adminInWorkspace;
};

// positions are halved on every drop between two cards, so after many drops two numbers get too close to
// each other (or equal). Then the whole column gets fresh positions (1000, 2000, ...) and the frontend reloads.
const MIN_GAP = 0.001;
const rebalanceIfNeeded = async (task) => {
  const column = await Task.find({ project: task.project, status: task.status }).sort({
    position: 1,
    _id: 1,
  });
  const tooClose = column.some(
    (t, i) => i > 0 && t.position - column[i - 1].position < MIN_GAP
  );
  if (!tooClose) return false;

  await Task.bulkWrite(
    column.map((t, i) => ({
      updateOne: { filter: { _id: t._id }, update: { $set: { position: (i + 1) * 1000 } } },
    }))
  );
  return true;
};

//CREATE TASK 
const createTask = async (req, res) => {
  try {
    const { userId } = req.user;

    const { title, description, assignedTo, status,priority } = req.body;
    const workspace = req.workspace;
    const project = req.project;

    if (!title || typeof title !== "string" || !title.trim()) {
      return res.status(400).json({ message: "Please give a valid title" });
    }

    const finalStatus = status && allowedStatus.includes(status) ? status : "todo";

    const finalPriority=priority && allowedPriority.includes(priority) ? priority:'medium';
    // Validate assignee (only if provided)
    if (assignedTo && !canBeAssigned(workspace, project, assignedTo)) {
      return res.status(400).json({ message: "Assignee must be a member of this project" });
    }

    const lastTask = await Task.findOne({
      project: project._id,
      status: finalStatus,
    }).sort({ position: -1 });

    const newTask = await Task.create({
      title,
      description: description || "",
      createdBy: userId,
      workspace: workspace._id,
      status: finalStatus,
      project: project._id,
      priority:finalPriority,
      assignedTo: assignedTo || undefined,
      position: lastTask ? lastTask.position + 1000 : 1000,
    });

    return res.status(201).json({
      message: "Task created successfully",
      task: newTask,
    });
  } catch (err) {
    return sendError(res, err, "Failed to create task");
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
    return sendError(res, err);
  }
};

//  GET SINGLE TASK 
const getSingleTaskDetails = async (req, res) => {
  try {
    const { taskId } = req.params;
    const project = req.project;
    const workspace = req.workspace;

    const task = await Task.findById(taskId).populate('createdBy','name').populate('assignedTo','name');
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
    return sendError(res, err);
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

    if (title !== undefined && (typeof title !== "string" || !title.trim())) {
      return res.status(400).json({ message: "Please give a valid title" });
    }

    if (priority !== undefined && !allowedPriority.includes(priority)) {
      return res.status(400).json({ message: "Invalid priority" });
    }

    if (assignedTo && !canBeAssigned(workspace, project, assignedTo)) {
      return res.status(400).json({ message: "Assignee must be a member of this project" });
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (priority !== undefined) updateData.priority = priority;
    if (assignedTo !== undefined) updateData.assignedTo = assignedTo || null;

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
    return sendError(res, err);
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

    await Comment.deleteMany({ taskId });   //its comments go with it
    await Task.findByIdAndDelete(taskId);

    return res.status(204).send();
  } catch (err) {
    return sendError(res, err);
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

    if (status && !allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    if (typeof position !== "number" || !Number.isFinite(position)) {
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
    const rebalanced = await rebalanceIfNeeded(task);

    return res.status(200).json({
      message: "Task moved successfully",
      task,
      rebalanced,
    });
  } catch (err) {
    return sendError(res, err, "Failed to move task");
  }
};

const moveTaskWorkspace = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status, position } = req.body;
    const { userId } = req.user;
    const workspace = req.workspace;

    // 1. Validate input
    if (!status || !allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    if (typeof position !== "number" || !Number.isFinite(position)) {
      return res.status(400).json({ message: "Invalid position" });
    }

    // 2. Find task
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // 3. Ensure task belongs to workspace
    if (task.workspace.toString() !== workspace._id.toString()) {
      return res.status(403).json({ message: "Task not in workspace" });
    }

    // an archived project is read only
    const project = await Project.findById(task.project);
    if (!project) return res.status(404).json({ message: "Project not found" });
    if (project.status === "archived") {
      return res.status(409).json({ message: "This project is archived, so it cannot be changed" });
    }

    // 4. Permission check
    const member = workspace.members.find(
      (m) => m.user.toString() === userId.toString()
    );

    if (!member) {
      return res.status(403).json({ message: "Not a workspace member" });
    }

    const isWorkspaceAdmin = member.role === "admin";
    const isCreator = task.createdBy.toString() === userId.toString();
    const isAssignee =
      task.assignedTo &&
      task.assignedTo.toString() === userId.toString();

    if (!isWorkspaceAdmin && !isCreator && !isAssignee) {
      return res.status(403).json({ message: "Not allowed to move task" });
    }

    // 5. Update task
    task.status = status;
    task.position = position;

    await task.save();
    const rebalanced = await rebalanceIfNeeded(task);

    return res.status(200).json({
      message: "Task moved successfully",
      task,
      rebalanced,
    });
  } catch (err) {
    return sendError(res, err, "Failed to move task");
  }
};

// MY TASKS 
const getMyTasks = async (req, res) => {
  try {
    const workspace = req.workspace;
    const { userId } = req.user;

    // only tasks of projects that still exist
    const projectIds = await Project.find({ workspaceId: workspace._id }).distinct("_id");

    const tasks = await Task.find({
      workspace: workspace._id,
      assignedTo: userId,
      project: { $in: projectIds },
    })
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .sort({ status: 1, position: 1 });

    return res.status(200).json({
      message: "My tasks fetched successfully",
      tasks,
    });
  } catch (err) {
    return sendError(res, err, "Failed to fetch my tasks");
  }
};

export { createTask, getAllTasksInProject, getSingleTaskDetails, updateTask, deleteTask, moveTask, moveTaskWorkspace, getMyTasks };
