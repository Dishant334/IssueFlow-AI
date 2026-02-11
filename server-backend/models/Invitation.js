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

invitationSchema.index(
{workspaceId:1,email:1,status:1},  /**1 means ascending and -1 means descending */
{unique:true}               /**This is used to create a combined document {A,John@gmail.com} which is combinedly unique. Now if two request {A,john@gmail.com,pending} and {A,john@gmail.com,pending} comes then mongodb would now use it*/
)
const Invitation = mongoose.model("Invitation",invitationSchema)

export default Invitation;