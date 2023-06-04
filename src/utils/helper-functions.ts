import { NextFunction, Request, Response } from "express";
import Rooms from "../models/room";
import Users from "../models/user";
import mongoose from "mongoose";

const apiKey = process.env.API_KEY;

// Middleware function to check if API key is valid
export const apiKeyMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const apiKeyHeader = req.headers['apikey'];
  if (!apiKeyHeader || apiKeyHeader !== apiKey) {
    return res.status(401).send('Unauthorized');
  }
  next();
};

// Apply the middleware to all routes


export const ListenAuctions = async () => {
  if (mongoose.ConnectionStates.connected) {
    try {
      Rooms.find({}).maxTimeMS(20000).then(async (rooms) => {
        console.log('total rooms : ', rooms.length)
        for (let i = 0; i < rooms.length; i++) {
          if (new Date(rooms[i].startingTime).getTime() < Date.now() && new Date(rooms[i].endingTime).getTime() > Date.now()) {
            const isEligible = rooms[i].timestamp! - Date.now() >= 25000 || Date.now() - rooms[i].timestamp! >= 25000;
            console.log('eligibility - ', isEligible);
            if (isEligible) {
              const nextIndex = rooms[i].activeBidderIndex! < rooms[i].participants.length - 1 ? rooms[i].activeBidderIndex! + 1 : 0;
              const nextParticipant = rooms[i].participants[nextIndex].userId;
              rooms[i].activeBidderIndex = nextIndex;
              rooms[i].activeBidder = nextParticipant;
              rooms[i].timestamp = Date.now();
              await rooms[i].save();
              console.log("next user index : ", nextIndex);
            }

          }
          else {
            if (new Date(rooms[i].endingTime).getTime() < Date.now()) {
              if (rooms[i].participants?.length > 0) {
                const sorted = rooms[i].participants?.sort((a, b) => {
                  if (a.bidAmount < b.bidAmount) {
                    return 1
                  }
                  else {
                    return -1
                  }
                })
               if(sorted.length > 0){
                const user = await Users.findOne({ userId: sorted[0].userId })
                const owner = await Users.findOne({ userId: rooms[i].admin })
                if (user && owner) {
                  user.cart = [...user.cart, {
                    productDetails: rooms[i].productDetails,
                    price: sorted[0].bidAmount,
                    owner
                  }]
                  await user.save()
                  owner.CompletedAuctions = [...owner.CompletedAuctions, {
                    productDetails:rooms[i].productDetails,
                    newOwner:user
                  }]
                  await owner.save()
                }
               }

              }
              await Rooms.findByIdAndDelete(rooms[i]._id)
              console.log('deleted')
            }

          }
        }
      })
    } catch (error) {

    }
  }

  setTimeout(() => {
    ListenAuctions()
  }, 5000);
}