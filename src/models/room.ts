import { Schema,model } from 'mongoose'


const room = new Schema({
    roomId:{ type:String,unique:true },
    isPrivate:{ type:Boolean },
    maximumParticipants: Number,
    productDetails:{
        type:{
            name:String,
            description:String,
            imageUrl:String
        },
        required:true
    },
    currentBidPrice:{type:String },
    entryCode:{type:String,unique:true },
    participants:{ type: Array,required:true },
    basePrice:{ type:Number,required:true },
    startingTime:{ type:String,required:true },
    endingTime:{type:String,required:true },
    activeBidder:String,
    activeBidderIndex:Number,
    timestamp:Number,
    admin:String
})

export default model("Rooms",room)