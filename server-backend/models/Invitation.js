import mongoose from 'mongoose'

const invitationSchema = mongoose.Schema({
    workspaceId : {
         type: mongoose.Schema.Types.ObjectId,
        ref: "Workspace",
        required: true
    },
    email:{
        type:String,
        lowercase:true,
        trim:true,
        required:true
    },role:{
        type:String,
        enum:["admin","member"],
        default:"member",
    },invitedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },token:{
        type:String,
        required:true,
        unique:true,
    },status:{
        type:String,
        default:"pending",
         enum:["pending","expired","cancelled","accepted"]
    },expiresAt:{
        type:Date,
        required:true
}},{timestamps:true})    /*Timestamp keeps track of data created and last updated date */

/* only one PENDING invite per workspace and email. Cancelled, expired and accepted invites can repeat
   (with the old index of (workspace, email, status) a second cancel of the same email failed with a duplicate key) */
invitationSchema.index(
{workspaceId:1,email:1},
{unique:true,partialFilterExpression:{status:"pending"}}
)
const Invitation = mongoose.model("Invitation",invitationSchema)

export default Invitation;