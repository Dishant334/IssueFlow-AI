import mongoose from 'mongoose'

const taskSchema=new mongoose.Schema({
    title:{
        type:String,
         required:true,
         maxLength:100,
         trim:true,
         
    },
    description:{
        type:String,
        maxLength:200,
        trim:true,
        default:''
    },
    createdBy:{     //a user
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    workspace:{     //workspace
        type:mongoose.Schema.Types.ObjectId,
        ref:"Workspace",
        required:true,
    },
    project:{     //project
        type:mongoose.Schema.Types.ObjectId,
        ref:"Project",
        required:true
    },
    assignedTo:{   //assigned To a user
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    priority:{
        type:String,
        enum:['low','medium','high'],
        default:'medium',
        required:true
    },
    status:{
        type:String,
        enum:['todo','in_progress','done'],
        default:'todo',
        required:true
    },
    position:{
        type:Number,
        required:true
    }

},{timestamps:true})

taskSchema.index({project:1,status:1,position:1});
taskSchema.index({workspace:1});
taskSchema.index({workspace:1,assignedTo:1});

const Task=mongoose.model('Task',taskSchema)

export {Task}