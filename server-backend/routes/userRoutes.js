import express from "express";
import { forgotPassword, loginUser, logoutUser, refreshAccessToken, registerUser, resetPassword } from "../controllers/userController.js";


const userRoutes=express.Router();

userRoutes.post('/register',registerUser)
userRoutes.post('/login',loginUser)
userRoutes.post('/refresh',refreshAccessToken)
userRoutes.post('/logout',logoutUser)
userRoutes.post('/forgot-password',forgotPassword)
userRoutes.post('/reset-password/:token',resetPassword)

export default userRoutes