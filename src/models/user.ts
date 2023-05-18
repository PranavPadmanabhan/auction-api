import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userId:{ type: String, unique:true },
    name:String,
    userName:String,
    email:String,
    image:String,
    document:String,
    PAN:String,
    contactDetails:{
        type:{
            phone:String,
            countryCode:String
        }
    }
})

export default mongoose.model('Users',userSchema);