import bcrypt from "bcrypt"
import User from "../models/User.js"
import jwt from 'jsonwebtoken'

const generateToken= (userId,role)=>{
    return jwt.sign({userId,role},process.env.JWT_SECRET,{expiresIn:'15m'})
}

const generateRefreshToken= (userId)=>{
    return jwt.sign({userId},process.env.JWT_REFRESH_SECRET,{expiresIn:'7d'})
}

// :POST /api/users/register
export const registerUser= async (req,res)=>{
    try{
    const {name,email,password}=req.body;

    if(!name || !email || !password){                            //if it doen't exist return missing data              
         return res.status(401).json({message:"Missing value"})
    }

    if(await User.findOne({email})){                                    //email already exists in db
        return res.status(400).json({message:"User already exists"})
    }
    
    const hashedPassword=await bcrypt.hash(password,10);

    const newUser= await User.create({
        name:name,
        email:email,
        password:hashedPassword,
        role:"developer"
    })
     const token=generateToken(newUser._id,newUser.role)
     newUser.password=undefined;

    res.status(200).json({message:'User created successfully',token,user:newUser})
}catch(err){
    res.status(500).json(err)
}
}
// :POST /api/users/login
export const loginUser=async(req,res)=>{
    try{
    const {email,password}=req.body

 

    if(!email || !password) return res.status(400).json({message:"Missing Value"})

     const user=await User.findOne({email})

        if(!user) return res.status(400).json({message:"User not found"})
     
     

    const isMatch = await user.comparePassword(password);
if (!isMatch) {
  return res.status(401).json({ message: "Invalid password or email" });
}


     const token=generateToken(user._id,user.role)
     const refreshToken=generateRefreshToken(user._id)
     user.refreshToken=refreshToken                  //saved in db so logout can remove it
     await user.save()
     user.password=undefined;

     return res.status(200).json({message:"Login Successful",token,refreshToken,user})
    }catch(err){
        return res.status(500).json({message:"Internal error",err})
    }
}

// :POST /api/users/refresh
export const refreshAccessToken=async(req,res)=>{
    try{
    const {refreshToken}=req.body

    if(!refreshToken) return res.status(401).json({message:"Unauthorized"})

    const decoded=jwt.verify(refreshToken,process.env.JWT_REFRESH_SECRET)

    const user=await User.findById(decoded.userId).select("+refreshToken")
    if(!user || user.refreshToken!==refreshToken){         //logged out or token replaced by a new login
        return res.status(401).json({message:"Unauthorized"})
    }

    const token=generateToken(user._id,user.role)
    return res.status(200).json({token})
    }catch(err){
        return res.status(401).json({message:"Unauthorized"})
    }
}

// :POST /api/users/logout
export const logoutUser=async(req,res)=>{
    try{
    const {refreshToken}=req.body
    await User.findOneAndUpdate({refreshToken},{refreshToken:null})
    return res.status(200).json({message:"Logged out"})
    }catch(err){
        return res.status(500).json({message:"Internal error"})
    }
}