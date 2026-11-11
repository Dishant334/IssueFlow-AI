import Workspace from "../models/Workspace.js";
import { sendError } from "../utils/handleError.js";



// : POST /api/workspace
const addWorkspace=async(req,res)=>{
    try{
   const {name}=req.body;
   const currUser=req.user.userId; //from auth middleware

   if(!name || typeof name!=='string' || !name.trim()) return res.status(400).json({message:"Enter the name"})
   


  const newworkspace =await Workspace.create({
        name:name,
        createdBy:currUser,
        members: [{user:currUser,role:"admin"}]
    })    

    res.status(200).json({message:"Workspace created successfully",newworkspace})
}catch(err){
    return sendError(res,err)
  }}


// GET /api/workspaces
const getWorkspaces = async (req, res) => {
  try {
    const { userId } = req.user;

    // find all workspaces where user is a member
    const workspaces = await Workspace.find({   //return a array
      "members.user": userId
    }).select("name members");

    // return only what frontend needs
    const result = workspaces.map((workspace) => {   
      const myMembership = workspace.members.find(    //from members find role 
        (m) => m.user.toString() === userId
      );
      

      return {
        id: workspace._id,
        name: workspace.name,
        role: myMembership.role
      };
    });

    res.status(200).json(result);
  } catch(err){
    return sendError(res,err)
  }
};


// GET /api/workspace/:workspaceid
const getSingleWorkspace= async(req,res)=>{
  try{
    const {userId}=req.user
    const {workspaceid}= req.params;
     
    const reqworkspace=await Workspace.findById(workspaceid)
    
      if(!reqworkspace) return res.status(404).json({message:"404 Not Found"})

    const myMembership = reqworkspace.members.find(    //from members find role 
      (m) => m.user.toString() === userId
    );
    if(!myMembership) return res.status(403).json({message:"Not a member"})

    return res.status(200).json({
      id: reqworkspace._id,
      name: reqworkspace.name,
      role: myMembership.role
    })
  }catch(err){
   return sendError(res,err,"Internal error occurred")
  }
}

export { addWorkspace, getWorkspaces, getSingleWorkspace};
