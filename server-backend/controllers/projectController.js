import Project from "../models/Projects.js";
import Workspace from "../models/Workspace.js";

//GET /projects/:projectId
const getproject=async(req,res)=>{
    try{
    const {userId}=req.user
    const {projectId}=req.params
     if(!projectId) return res.status(404).json({message:"Wrong Project id"})

    const project=await Project.findById(projectId).populate("members.user","name").populate("createdBy","name")
    if(!project) return res.status(404).json({message:"No Project Found"})
    
    const projectmember=project.members.find(m=>m.user._id.toString() === userId.toString())

    const workspaceid=project.workspaceId;
    const workspace=await Workspace.findById(workspaceid)
       if(!workspace) return res.status(404).json({message:"No workspace found"})
    const reqworkspace=workspace.members.find(m=>m.user.toString() === userId.toString())
      if(!reqworkspace) return res.status(404).json({message:"Member not in this workspace"})
      if(!projectmember && reqworkspace.role!=='admin') return res.status(403).json({message:"You are not authorized to access this project"})

   return res.status(200).json({
         projectName:project.name,
         projectMembers:project.members.map(m=>{
            return {name:m.user.name,role:m.role,joinedAt:m.joinedAt}
         }),
         projectDescription:project.description,
         projectStatus:project.status,
         projectCreater:project.createdBy.name,
   })}
   catch(err){
    return res.status(500).json({message:"Something went wrong"})
   }
}

// POST /workspace/:workspace/projects
 const createProject=async(req,res)=>{
    try{
    const {userId}=req.user
  const {workspaceid}=req.params
  const {projectName,projectDesc}=req.body
  if(!workspaceid) return res.status(400).json({message:"Workspace not selected"})
  if(!projectName) return res.status(400).json({message:"Please Fill the Project Name"})
    const normalizedName = projectName.trim().toLowerCase()
    const duplicateName = await Project.findOne({name:normalizedName,workspaceId:workspaceid})
    if(duplicateName) return res.status(400).json({message:"This project name is already there"})
    const workspaces =await Workspace.findById(workspaceid)
    if(!workspaces) return res.status(404).json({message:"Workspace not dound"})
    const member = workspaces.members.find(m=>m.user.toString() === userId.toString())
    if(!member) return res.status(403).json({message:"Member not found in Workspace"})
    if(member.role != 'admin') return res.status(403).json("You cannot create new project")

        await Project.create({
      workspaceId:workspaceid,
      name:normalizedName,
      description:projectDesc,
      members:[
        {
            user:userId,
            role:"project_admin"
        }
      ],
      status:"active",
      createdBy:userId
  })

  return res.status(201).json({message:"Project created successfully"})
}catch(err){
    return res.status(500).json({message:"Something went wrong"})
}
 }

//POST /projects/:projectId/members
const addMembers = async (req, res) => {
  try {
    const  project =req.project
    const { userId } = req.user;
    const { userIds } = req.body;

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ message: "No users provided" });
    }

    const workspace = await Workspace.findById(project.workspaceId);
    if (!workspace)
      return res.status(404).json({ message: "Workspace not found" });

    const workspaceMember = workspace.members.find(
      (m) => m.user.toString() === userId.toString()
    );

    if (!workspaceMember)
      return res.status(403).json({ message: "Not part of workspace" });

    const isWorkspaceAdmin = workspaceMember.role === "admin";

    const projectMember = project.members.find(
      (m) => m.user.toString() === userId.toString()
    );

    const isProjectAdmin = projectMember?.role === "project_admin";

    if (!isWorkspaceAdmin && !isProjectAdmin) {
      return res.status(403).json({ message: "Not allowed to add members" });
    }

    // Validate all target users belong to workspace
    const workspaceUserIds = workspace.members.map((m) =>
      m.user.toString()
    );

    const invalidUsers = userIds.filter(
      (id) => !workspaceUserIds.includes(id.toString())
    );

    if (invalidUsers.length > 0) {
      return res.status(400).json({
        message: "Some users do not belong to this workspace",
      });
    }

    // Prevent duplicates
    const existingProjectUserIds = project.members.map((m) =>
      m.user.toString()
    );

    const newUsers = userIds.filter(
      (id) => !existingProjectUserIds.includes(id.toString())
    );

    if (newUsers.length === 0) {
      return res
        .status(400)
        .json({ message: "All users are already project members" });
    }

    newUsers.forEach((id) => {
      project.members.push({
        user: id,
        role: "member",
      });
    });

    await project.save();

    return res.status(201).json({
      message: "Members added successfully",
      addedCount: newUsers.length,
    });
  } catch (err) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

// PATCH /projects/:projectId/members/:memberId/role
const updateRole = async (req, res) => {
  try {
    const {  memberId } = req.params;
    const { role } = req.body;
    const { userId } = req.user;

    //  Validate role
    if (!["member", "project_admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role provided" });
    }

    //  Fetch project
    const project=req.project

    //  Fetch workspace
    const workspace = await Workspace.findById(project.workspaceId);
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    //  Validate requester in workspace
    const workspaceMember = workspace.members.find(
      (m) => m.user.toString() === userId.toString()
    );

    if (!workspaceMember) {
      return res.status(403).json({ message: "Not part of workspace" });
    }

    const isWorkspaceAdmin = workspaceMember.role === "admin";

    //  Find requester inside project (if exists)
    const requesterProjectMember = project.members.find(
      (m) => m.user.toString() === userId.toString()
    );

    const isRequesterProjectAdmin =
      requesterProjectMember?.role === "project_admin";

    // Find target member in project
    const targetMember = project.members.find(
      (m) => m.user.toString() === memberId.toString()
    );

    if (!targetMember) {
      return res.status(404).json({ message: "Target member not found in project" });
    }

    const currentRole = targetMember.role;

    //  Idempotent check
    if (currentRole === role) {
      return res.status(200).json({ message: "Role already set" });
    }

    // Promotion logic
    if (currentRole === "member" && role === "project_admin") {
      if (!isWorkspaceAdmin && !isRequesterProjectAdmin) {
        return res.status(403).json({
          message: "Not authorized to promote member",
        });
      }
    }

    //  Demotion logic
    if (currentRole === "project_admin" && role === "member") {
      // Only workspace admin can demote
      if (!isWorkspaceAdmin) {
        return res.status(403).json({
          message: "Only workspace admin can demote project admin",
        });
      }

      // Prevent demoting last project_admin
      const projectAdminCount = project.members.filter(
        (m) => m.role === "project_admin"
      ).length;

      if (projectAdminCount === 1) {
        return res.status(400).json({
          message: "Cannot demote the last project admin",
        });
      }
    }

    // Update role
    targetMember.role = role;
    await project.save();

    return res.status(200).json({
      message: "Role updated successfully",
    });
  } catch (err) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

//DELETE /projects/:projectId/members/:memberId
const deleteMember=async(req,res)=>{
  try{
  const {memberId}=req.params
  const {userId}=req.user

  const project=req.project
  const member= project.members.find(m=>m.user.toString()==memberId.toString())
 if(!member) return res.status(404).json({message:"Target member not found"})
  const clickerInProject= project.members.find(m=>m.user.toString()===userId.toString())

  const workspace=await Workspace.findById(project.workspaceId)
  if(!workspace) return res.status(404).json({message:"Workspace not found"})
  const clickerInWorkspace = workspace.members.find(m=>m.user.toString() === userId.toString())
  if(!clickerInWorkspace) return res.status(403).json({message:"You are not authorized"})

  if(clickerInProject?.role!='project_admin' && clickerInWorkspace.role!='admin') return res.status(403).json({message:"You are not authorized"})

  project.members = project.members.filter(m=>m.user.toString() !=memberId.toString())
  await project.save()
  return res.status(200).json({message:"Member deleted successfully"})
}catch(err){
  res.status(500).json({message:"Something went wrong"})
}
}

//Patch /project/:projectId/archive
const projectdetailUpdate=async(req,res)=>{

  const {status}=req.body
  const {userId}=req.user
   if(!['active','archived'].includes(status)){
    return res.status(400).json({message:"You selected something wrong"})
   }
  try{
  const {projectId}= req.params;
  if(!projectId) return res.status(404).json({message:"Project does not exist"})

  const project= await Project.findById(projectId)
  if(!project) return res.status(404).json({message:"No project exists"})
  const workspace= await Workspace.findById(project.workspaceId)
  if(!workspace) return res.status(404).json({message:"Workspace not selected"})
  
  const clickerInProject=project.members.find(m=>m.user.toString()===userId.toString())
  const clickerInWorkspace=workspace.members.find(m=>m.user.toString()===userId.toString())

  if(!clickerInWorkspace) return res.status(403).json({message:"You are not authorized"})
  const clickerRoleInProject=clickerInProject?.role
  const clickerRoleInWorkspace=clickerInWorkspace?.role

  if(clickerRoleInProject!='project_admin' && clickerRoleInWorkspace!='admin') return res.status(403).json({message:"You are not allowed to change the status of project"})


  if(project.status  === status) return res.status(409).json({messgae:"Status is already set"})
  
  project.status=status
 await project.save()

 return res.status(200).json({message:"Status Updated Sucessfully"})
  }
  catch(err){
   return res.status(500).json({message:"Something went wrong"}) 
  }
}

//Get/workspaces/:workspaceid/project
const getAllProjects=async (req,res)=>{
  try{
  const {workspaceid}=req.params
  const {userId}=req.user
  let projects=[]

  const workspace=await Workspace.findById(workspaceid)
  if(!workspace) return res.status(404).json({message:"Workspace not found"})
  const member=workspace.members.find(m=>m.user.toString()===userId.toString())
  if(!member) return res.status(403).json({message:"You are not authorized"})
  
    if(member.role==='admin'){
      projects= await Project.find({workspaceId:workspaceid}).select('name description status createdAt')
    }else{
      projects= await Project.find({workspaceId:workspaceid,'members.user':userId}).select('name description status createdAt')
    }
    return res.status(200).json(projects)
}catch(err){
  return res.status(500).json({message:"Something went wrong"})
}
}

// PATCH /projects/:projectId
const updateProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    const { userId } = req.user;

    //  Validate input
    if (!name && !description) {
      return res.status(400).json({
        message: "At least one field (name or description) must be provided",
      });
    }

    //  Fetch project
    const project = req.project;
   

    //  Archive lock
    if (project.status === "archived") {
      return res.status(409).json({
        message: "Archived project cannot be modified",
      });
    }

    //  Fetch workspace
    const workspace = await Workspace.findById(project.workspaceId);
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    //  Validate requester in workspace
    const workspaceMember = workspace.members.find(
      (m) => m.user.toString() === userId.toString()
    );

    if (!workspaceMember) {
      return res.status(403).json({ message: "Not part of workspace" });
    }

    const isWorkspaceAdmin = workspaceMember.role === "admin";

    // Check if requester is project admin
    const projectMember = project.members.find(
      (m) => m.user.toString() === userId.toString()
    );

    const isProjectAdmin = projectMember?.role === "project_admin";

    if (!isWorkspaceAdmin && !isProjectAdmin) {
      return res.status(403).json({
        message: "Not authorized to update project",
      });
    }

    //  Handle name update
    if (name) {
      const normalizedName = name.trim().toLowerCase();

      if (!normalizedName) {
        return res.status(400).json({
          message: "Project name cannot be empty",
        });
      }

      const duplicate = await Project.findOne({
        workspaceId: project.workspaceId,
        name: normalizedName,
        _id: { $ne: projectId },
      });

      if (duplicate) {
        return res.status(400).json({
          message: "Project name already exists in this workspace",
        });
      }

      project.name = normalizedName;
    }

    //  Handle description update
    if (description !== undefined) {
      project.description = description;
    }

    await project.save();

    return res.status(200).json({
      message: "Project updated successfully",
    });
  } catch (err) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};
//DELETE /projects/:projectId
const deleteProject=async(req,res)=>{
  try{
const {userId}=req.user
const {projectId}=req.params
const project=await Project.findById(projectId)
if(!project) return res.status(404).json({message:"Project not found"})
if(project.status!='archived') return res.status(409).json({message:"You cannot delete a active project"})
const workspace= await Workspace.findById(project.workspaceId)
if(!workspace) return res.status(404).json({message:"Workspace does not exist"})
 
const clickerInWorkspace=workspace.members.find(m=>m.user.toString()===userId.toString())
if(!clickerInWorkspace) return res.status(403).json({message:"You are not authorized"})
if(clickerInWorkspace.role!='admin') return res.status(403).json({message:"You are not authorized"})
  
await Project.findByIdAndDelete(projectId)
return res.status(204).json({message:"Project deleted successfully"})
  }catch(err){
    return res.status(500).json({message:"Something went wrong"})
  }
}

export {getproject,createProject,addMembers,updateRole,updateProject,projectdetailUpdate,getAllProjects,deleteMember,deleteProject}