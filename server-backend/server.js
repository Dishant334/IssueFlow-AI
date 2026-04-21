import express from 'express'
import cors from 'cors'
import "dotenv/config"
import connectDB from './config/db.js'
import userRouter from './routes/userRoutes.js'
import workspaceRouter from './routes/workspaceRoute.js'
import { inviteRouter } from './routes/invitationRoutes.js'
import projectRouter from './routes/projectRoutes.js'
import taskRoute from './routes/taskRoutes.js'
import homeRoute from './routes/homeRoute.js'
import settingRoute from './routes/settingRoute.js'
import commentRoute from './routes/commentRoute.js'
import { initSocket } from './services/socketServices.js'
import aiRoute from './routes/aiRoutes.js'

const app=express()
const port=process.env.PORT || 7001

connectDB();

app.use(express.json()) //to parse data to JSON format
app.use(cors())
app.use('/api/users',userRouter)
app.use('/api',workspaceRouter)
app.use('/api',inviteRouter)
app.use('/api',projectRouter)
app.use('/api',taskRoute)
app.use('/api',homeRoute)
app.use('/api',settingRoute)
app.use('/api',commentRoute)
app.use('/api/ai',aiRoute)



app.get('/',(req,res)=>{
    res.send("server is live")
})
const server = app.listen(port,()=>{
    console.log("Server is running")
})

//initialize socket
initSocket(server)
