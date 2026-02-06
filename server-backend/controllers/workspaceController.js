import Workspace from "../models/Workspace.js";



// : POST /api/addworkspaces
const addWorkspace=async(req,res)=>{
    try{
   const {name}=req.body;
   const currUser=req.user.userId; //from auth middleware

   if(!name) return res.status(400).json({message:"Enter the name"})
   


  const newworkspace =await Workspace.create({
        name:name,
        createdBy:currUser,
        members: [{user:currUser,role:"admin"}]
    })    

    res.status(200).json({message:"Workspace created successfully",newworkspace})
}catch(err){
  res.status(500).json({message:"Something went wrong"})
}}


//:GET /api/getworkspaces
const getWorkspaces=async (req,res)=>{
    try{
        const {userId}=req.user
      const workspaces= await Workspace.find({userId})

      res.status(200).json(workspaces)
    }catch(err){
      res.status(500).json("Internal error occured")
    }
}

