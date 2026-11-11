import express from "express";
import { forgotEmailLimit, forgotIpLimit, loginGuard, refreshLimit, registerLimit, resetLimit } from "../authMiddleWare/rateLimit.js";
import { forgotPassword, loginUser, logoutUser, refreshAccessToken, registerUser, resetPassword } from "../controllers/userController.js";


const userRoutes=express.Router();

userRoutes.post('/register',registerLimit,registerUser)
userRoutes.post('/login',loginGuard,loginUser)
userRoutes.post('/refresh',refreshLimit,refreshAccessToken)
userRoutes.post('/logout',logoutUser)
userRoutes.post('/forgot-password',forgotIpLimit,forgotEmailLimit,forgotPassword)
userRoutes.post('/reset-password/:token',resetLimit,resetPassword)

export default userRoutes