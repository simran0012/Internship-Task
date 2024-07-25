import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{type:String , require:true, trim:true},
    email:{type:String , require:true, trim:true, unique:true},
    password:{type:String , require:true, trim:true},
    tc:{type:Boolean , require:true, trim:true}
})
const userModel = mongoose.model("User",userSchema)

export default userModel;