// for the routes that change things: an archived project is read only (needs req.project from validateProjectAccess)
const projectNotArchived=(req,res,next)=>{
    if(req.project?.status==='archived'){
        return res.status(409).json({message:"This project is archived, so it cannot be changed"})
    }
    next()
}

export default projectNotArchived
