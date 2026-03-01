import mongoose from 'mongoose'

const projectMemberSchema = new mongoose.Schema(
  {
    user: {    //real user
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    role: {     // role admin or member
      type: String,
      enum: ["project_admin", "member"],
      default: "member"
    },
    joinedAt: {    
      type: Date,
      default: Date.now
    }
  },
  { _id: false }
);

const ProjectSchema=new mongoose.Schema({
       workspaceId : {
             type: mongoose.Schema.Types.ObjectId,
            ref: "Workspace",
            required: true  
        },
        name:{
            type:String,
            required:true,
            trim:true,
             
        },
        description:{
            type:String,
            maxLength:40,
            trim:true
        }
        ,
        members:[projectMemberSchema]
        ,createdBy:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required:true
        },
        status: {
        type: String,
        enum: ["active", "archived"],
        default: "active"
        }
},{timestamps:true})

ProjectSchema.index(
{workspaceId:1,name:1},  
{unique:true}              
)

const Project = mongoose.model("Project",ProjectSchema)
export default Project;