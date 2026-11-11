import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const UserSchema=new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true,lowercase:true,trim:true},
    password:{type:String,required:true},
    role:{type:String,default:"developer"},
    refreshToken:{type:String,select:false}
},{timestamps:true})

UserSchema.methods.comparePassword=function(password){
    return bcrypt.compareSync(password,this.password)
}

const User=mongoose.model("User",UserSchema)

export default User;

