import express from 'express'
import cors from 'cors'
import "dotenv/config"
import connectDB from './config/db.js'
import userRouter from './routes/userRoutes.js'
import workspaceRouter from './routes/workspaceRoute.js'
import { inviteRouter } from './routes/invitationRoutes.js'

const app=express()
const port=process.env.PORT || 7001

connectDB();

app.use(express.json()) //to parse data to JSON format
app.use(cors())
app.use('/api/users',userRouter)
app.use('/api',workspaceRouter)
app.use('/api',inviteRouter)

app.get('/',(req,res)=>{
    res.send("server is live")
})
app.listen(port,()=>{
    console.log("Server is running")
})
