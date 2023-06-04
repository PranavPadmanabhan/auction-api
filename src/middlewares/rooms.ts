import { Request, Response } from "express";
import Rooms from "../models/room";
import { v4 as uuidv4 } from 'uuid';
import Users from "../models/user";


function generateJoiningCode(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

export const CreateRoom = async (req: Request, res: Response) => {
    // console.log(req.body)
    const {
        maximumParticipants,
        isPrivate,
        productDetails,
        participants,
        basePrice,
        startingTime,
        endingTime,
        userId
    } = req.body;
    if (
        isPrivate !== null &&
        maximumParticipants &&
        productDetails &&
        participants &&
        basePrice &&
        startingTime &&
        endingTime &&
        userId
        ) {
           try {
            const user = await Users.findOne({ userId })
            const room = await Rooms.findOne({$or:[
                {productDetails:productDetails},
            ]})
            if(user && !room){
                const newRoom = new Rooms({
                    roomId:uuidv4(),
                    isPrivate:isPrivate,
                    basePrice,
                    endingTime,
                    startingTime,
                    participants:participants??[],
                    entryCode:generateJoiningCode(10),
                    productDetails:{
                        name:productDetails.name,
                        description:productDetails.description,
                        imageUrl:productDetails.imageUrl
                    },
                    activeBidder:null,
                    activeBidderIndex:0,
                    timestamp:Date.now(),
                    maximumParticipants,
                    currentBidPrice:basePrice,
                })
                const roomCreated = await newRoom.save();
                res.status(200).json({
                    error: false,
                    message: 'hosting successfull',
                    auction:roomCreated
                })
            }
            else if(room){
                res.status(200).json({
                    error: true,
                    message: 'room already exists'
                })
            }
            else {
                res.status(200).json({
                    error: true,
                    message: 'user not found'
                })
            }
           } catch (error:any) {
            res.status(200).json({
                error: true,
                message: error.message
            })
           }
    }
    else {
        res.status(200).json({
            error: true,
            message: 'fields are missing'
        })
    }
}

export const JoinPrivateRoom = async(req:Request,res:Response) => {
    const roomCode = req.query.private;
    const userId = req.params.userId
    if(roomCode && userId){
       try {
        const room = await Rooms.findOne({ entryCode:roomCode });
        const user = await Users.findOne({ userId });
        if(room && user){
           room.participants = [ ...room.participants,{...user,bidAmount:0} ]
           await room.save();
           res.status(200).json({
            error:false,
            message:'Joined successfully'
           })
        }
        else {
            res.status(200).json({
                error:true,
                message:'Something went wrong'
               })
        }
       } catch (error) {
        
       }
    }
    else {
        res.status(200).json({
            error:true,
            message:'fields are missing'
           })
    }
}

export const JoinPublicRoom = async(req:Request,res:Response) => {
    const roomCode = req.query.public;
    const userId = req.params.userId
    if(roomCode && userId){
       try {
        const room = await Rooms.findOne({ entryCode:roomCode });
        const user = await Users.findOne({ userId });
        if(room && user){
           room.participants = [ ...room.participants,{...user,bidAmount:0} ]
           await room.save();
           res.status(200).json({
            error:false,
            message:'Joined successfully'
           })
        }
        else {
            res.status(200).json({
                error:true,
                message:'Something went wrong'
               })
        }
       } catch (error) {
        
       }
    }
    else {
        res.status(200).json({
            error:true,
            message:'fields are missing'
           })
    }
}

export const GetRooms = async(req:Request,res:Response) => {
       try {
        const rooms = await Rooms.find({});
        if(rooms){
           res.status(200).json(rooms)
        }
        else {
            res.status(200).json({
                error:true,
                message:'Room Not Found'
               })
        }
       } catch (error) {
        
       }
}

export const GetRoom = async(req:Request,res:Response) => {
    const roomId = req.params.roomId
    if(roomId){
       try {
        const room = await Rooms.findOne({ roomId });
        if(room){
           res.status(200).json(room)
        }
        else {
            res.status(200).json({
                error:true,
                message:'Room Not Found'
               })
        }
       } catch (error) {
        
       }
    }
    else {
        res.status(200).json({
            error:true,
            message:'fields are missing'
           })
    }
}


export const Bid = async(req:Request,res:Response) => {
    const roomId = req.params.roomId
    const { increment,userId } = req.body
    if(roomId&& increment && userId){
       try {
        const user = await Users.findOne({ userId })
        const room = await Rooms.findOne({ roomId });
        if(room && user){
          if(new Date(room.endingTime).getTime() > Date.now()){
            room.participants = room.participants?.map(item => item.userId === userId?{...item,bidAmount:room.currentBidPrice! + parseInt(increment)}:item)
            const nextIndex = room.activeBidderIndex! < room.participants.length - 1?room.activeBidderIndex! + 1 : 0;
            const nextParticipant = room.participants[nextIndex].userId;
            room.activeBidderIndex = nextIndex;
            room.activeBidder = nextParticipant;
            room.timestamp = Date.now()
           await room.save();
           res.status(200).json(room)
          }
          else {
            res.status(200).json({
                error:true,
                message:'auction has ended'
               })
          }
        }
        else {
            res.status(200).json({
                error:true,
                message:'Room Not Found'
               })
        }
       } catch (error) {
        
       }
    }
    else {
        res.status(200).json({
            error:true,
            message:'fields are missing'
           })
    }
}


export const Skip = async(req:Request,res:Response) => {
    const roomId = req.params.roomId
    const { userId } = req.body
    if(roomId&& userId){
       try {
        const user = await Users.findOne({ userId })
        const room = await Rooms.findOne({ roomId });
        if(room && user){
          if(new Date(room.endingTime).getTime() > Date.now()){
            const nextIndex = room.activeBidderIndex! < room.participants.length - 1?room.activeBidderIndex! + 1 : 0;
            const nextParticipant = room.participants[nextIndex].userId;
            room.activeBidderIndex = nextIndex;
            room.activeBidder = nextParticipant;
            room.timestamp = Date.now()
           await room.save();
           res.status(200).json(room)
          }
          else {
            res.status(200).json({
                error:true,
                message:'auction has ended'
               })
          }
        }
        else {
            res.status(200).json({
                error:true,
                message:'Room Not Found'
               })
        }
       } catch (error) {
        
       }
    }
    else {
        res.status(200).json({
            error:true,
            message:'fields are missing'
           })
    }
}



export const GetActiveBidder = async(req:Request,res:Response) => {
    const { roomId } = req.params
    if(roomId){
        const room = await Rooms.findOne({ roomId })
        if(room){
            res.status(200).json({
                error:true,
                message:'success',
                activeBidder:room.activeBidder
               })
        }
        else {
            res.status(200).json({
                error:true,
                message:'room not found'
               })
        }
    }
    else {
        res.status(200).json({
            error:true,
            message:'key is missing'
           })
    }
}