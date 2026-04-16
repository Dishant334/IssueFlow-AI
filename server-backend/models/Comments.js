import mongoose from 'mongoose'

const commentSchema= mongoose.Schema({
    taskId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Task",
        required:true,
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    text:{
        type:String,
        required:true,
        trim:true,
    },
    isEdited:{
        type:Boolean,
        default:false
    }
},{timestamps:true})

commentSchema.index({taskId:1,createdAt:-1})

const Comment=mongoose.model('Comment',commentSchema)

export default Comment