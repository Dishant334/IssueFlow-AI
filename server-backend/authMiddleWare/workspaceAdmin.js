import Workspace from "../models/Workspace";

const workspaceAdmin = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { workspaceid } = req.params;

    const workspace = await Workspace.findById(workspaceid);

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    const isAdmin = workspace.members.some(m =>
      m.user.toString() === userId && m.role === "admin"
    );

    if (!isAdmin) {
      return res.status(403).json({ message: "You are not authorized" });
    }

    next();
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

export default workspaceAdmin;