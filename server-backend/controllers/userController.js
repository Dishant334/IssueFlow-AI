import bcrypt from "bcrypt"
import User from "../models/User.js"
import jwt from 'jsonwebtoken'

const generateToken= (userId,role)=>{
    return jwt.sign({userId,role},process.env.JWT_SECRET,{expiresIn:'7d'})
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
     user.password=undefined;

     return res.status(200).json({message:"Login Successful",token,user})
    }catch(err){
        return res.status(500).json({message:"Internal error",err})
    }
}