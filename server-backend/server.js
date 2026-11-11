import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
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
import Invitation from './models/Invitation.js'

// the server cannot work without these, so it stops right at the start with a clear message
const required=['MONGO_URI','JWT_SECRET','JWT_REFRESH_SECRET']
const missing=required.filter((name)=>!process.env[name])
if(missing.length>0){
    console.error(`Missing environment variables: ${missing.join(', ')}`)
    process.exit(1)
}
// these only break one feature, so the server still starts
const optional=['CLIENT_URL','HOST','EMAIL_USER','GOOGLE_APP_PASSWORD','GEMINI_API_KEY']
const notSet=optional.filter((name)=>!process.env[name])
if(notSet.length>0) console.warn(`Environment variables not set (some features will not work): ${notSet.join(', ')}`)

const app=express()
const port=process.env.PORT || 7001

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

// no route matched
app.use((req,res)=>{
    res.status(404).json({message:"Route not found"})
})

// anything that was not handled inside a controller ends here (bad json body, unexpected errors)
app.use((err,req,res,next)=>{
    if(res.headersSent) return next(err)
    if(err.type==='entity.parse.failed') return res.status(400).json({message:"Invalid JSON body"})
    console.error(err)
    res.status(500).json({message:"Something went wrong"})
})

// connect to the database first, then start listening
await connectDB();

// the old index of the invitations (workspace + email + status) is replaced by the one in the model
try{
    await Invitation.syncIndexes()
}catch(err){
    console.error("Could not update the invitation indexes:",err.message)
}

const server = app.listen(port,()=>{
    console.log("Server is running")
})

//initialize socket
initSocket(server)

// on a restart or a deploy: stop taking new requests, finish the running ones, close the database
const shutdown=()=>{
    server.close(async ()=>{
        await mongoose.connection.close()
        process.exit(0)
    })
}
process.on('SIGTERM',shutdown)
process.on('SIGINT',shutdown)
