import bcrypt from "bcrypt"
import User from "../models/User.js"
import jwt from 'jsonwebtoken'
import { sendError } from "../utils/handleError.js"
import crypto from "node:crypto"
import { sendResetPasswordEmail } from "../services/emailServices.js"
import { clearLoginFailures, recordLoginFailure } from "../authMiddleWare/rateLimit.js"

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

        if(!user){
          await recordLoginFailure(req)
          return res.status(400).json({message:"User not found"})
        }
     
     

    const isMatch = await user.comparePassword(password);
if (!isMatch) {
  await recordLoginFailure(req)
  return res.status(401).json({ message: "Invalid password or email" });
}

     await clearLoginFailures(req)   //a correct login starts the count again


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

const RESET_VALID_MS = 60 * 60 * 1000      // a reset link works for 1 hour
const RESET_COOLDOWN_MS = 60 * 1000        // and a new one can be asked once a minute

// :POST /api/users/forgot-password
export const forgotPassword=async(req,res)=>{
    try{
    const email=req.body.email?.toString().toLowerCase().trim()
    if(!email) return res.status(400).json({message:"Enter your email"})

    // the answer is the same whether the email exists or not, so nobody can find out who has an account
    const sameAnswer={message:"If an account with this email exists, we have sent a reset link to it"}

    const user=await User.findOne({email}).collation({locale:'en',strength:2}).select("+resetPasswordExpires")
    if(!user) return res.status(200).json(sameAnswer)

    // a link was sent less than a minute ago: do not send another mail
    const lastSentAt=user.resetPasswordExpires ? user.resetPasswordExpires.getTime()-RESET_VALID_MS : 0
    if(Date.now()-lastSentAt<RESET_COOLDOWN_MS) return res.status(200).json(sameAnswer)

    // only the hash is saved, the real token only exists in the email
    const rawToken=crypto.randomBytes(32).toString("hex")
    user.resetPasswordToken=crypto.createHash("sha256").update(rawToken).digest("hex")
    user.resetPasswordExpires=new Date(Date.now()+RESET_VALID_MS)
    await user.save()

    const resetLink=`${process.env.CLIENT_URL}/reset-password/${rawToken}`
    try{
        await sendResetPasswordEmail({to:user.email,name:user.name,resetLink})
    }catch(mailErr){
        // the mail did not go out, so the link is useless: remove it (the error is in the log)
        user.resetPasswordToken=undefined
        user.resetPasswordExpires=undefined
        await user.save()
    }

    return res.status(200).json(sameAnswer)
    }catch(err){
        return sendError(res,err)
    }
}

// :POST /api/users/reset-password/:token
export const resetPassword=async(req,res)=>{
    try{
    const {token}=req.params
    const {password}=req.body

    if(!password || typeof password!=="string" || password.length<6){
        return res.status(400).json({message:"Password must be at least 6 characters"})
    }

    const hashedToken=crypto.createHash("sha256").update(token).digest("hex")
    const user=await User.findOne({
        resetPasswordToken:hashedToken,
        resetPasswordExpires:{$gt:new Date()},
    }).select("+resetPasswordToken +resetPasswordExpires +refreshToken")

    if(!user) return res.status(400).json({message:"This reset link is invalid or has expired"})

    user.password=await bcrypt.hash(password,10)
    user.resetPasswordToken=undefined       // the link works only once
    user.resetPasswordExpires=undefined
    user.refreshToken=undefined             // everyone who was logged in with the old password is logged out
    await user.save()

    return res.status(200).json({message:"Password updated. You can log in now"})
    }catch(err){
        return sendError(res,err)
    }
}
