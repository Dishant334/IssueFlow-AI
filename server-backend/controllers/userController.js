import bcrypt from "bcrypt"
import User from "../models/User.js"
import jwt from 'jsonwebtoken'
import { sendError } from "../utils/handleError.js"

const generateToken= (userId,role)=>{
    return jwt.sign({userId,role},process.env.JWT_SECRET,{expiresIn:'15m'})
}

const generateRefreshToken= (userId)=>{
    return jwt.sign({userId},process.env.JWT_REFRESH_SECRET,{expiresIn:'7d'})
}

// :POST /api/users/register
export const registerUser= async (req,res)=>{
    try{
    const {name,password}=req.body;
    const email=req.body.email?.toString().toLowerCase().trim()   //one account per email, whatever the capital letters

    if(!name || !email || !password){                            //if it doen't exist return missing data              
         return res.status(401).json({message:"Missing value"})
    }

    if(await User.findOne({email}).collation({locale:'en',strength:2})){      //email already exists in db (older accounts may have capital letters)
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
    return sendError(res,err)
}
}
// :POST /api/users/login
export const loginUser=async(req,res)=>{
    try{
    const {password}=req.body
    const email=req.body.email?.toString().toLowerCase().trim()

    if(!email || !password) return res.status(400).json({message:"Missing Value"})

     const user=await User.findOne({email}).collation({locale:'en',strength:2})   //finds older accounts saved with capital letters too

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
        return sendError(res,err,"Internal error")
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