import jwt from "jsonwebtoken"
const protect=async(req,res,next)=>{
   let token; 
      if ( req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

    if(!token){
        return res.status(401).json({message:"Unauthorized"})
    }

    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET)
        req.user={
        userId : decoded.userId,
        role : decoded.role
        }

        next();
    }catch(err){
      return res.status(401).json({message:"Unauthorized"})
    }
}
export default protect;