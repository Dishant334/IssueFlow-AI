import mongoose from "mongoose";

const workspaceMemberSchema = new mongoose.Schema(
  {
    user: {    //real user
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    role: {     // role admin or member
      type: String,
      enum: ["admin", "member"],
      default: "member"
    },
    joinedAt: {    
      type: Date,
      default: Date.now
    }
  },
  { _id: false }
);

const WorkspaceSchema = new mongoose.Schema(
  {
    name: {   //name of workspace
      type: String,
      required: true,
      trim: true
    },
    createdBy: {   // name of the admin
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    members: {    // members of this workspace
      type: [workspaceMemberSchema],
      default: []
    }
  },
  { timestamps: true }
);

const Workspace = mongoose.model("Workspace", WorkspaceSchema);
export default Workspace;
