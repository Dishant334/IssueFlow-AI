
export default isSystemAdmin=(req,res,next)=>{

    const user=req.user.role

    if(!user || user != 'admin'){
     return res.status(403).json({message:"You are not authorized"})
    }
    next()
}