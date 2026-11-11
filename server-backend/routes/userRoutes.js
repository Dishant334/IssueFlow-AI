import express from "express";
import { loginUser, logoutUser, refreshAccessToken, registerUser } from "../controllers/userController.js";


const userRoutes=express.Router();

userRoutes.post('/register',registerUser)
userRoutes.post('/login',loginUser)
userRoutes.post('/refresh',refreshAccessToken)
userRoutes.post('/logout',logoutUser)

export default userRoutes