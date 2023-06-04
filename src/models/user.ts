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
    },
    cart:{
        type:Array
    },
    CompletedAuctions:{ type:Array }
})

export default mongoose.model('Users',userSchema);