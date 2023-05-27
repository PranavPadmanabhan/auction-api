import { NextFunction, Request, Response } from "express";
import Rooms from "../models/room";

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
   Rooms.find().then(async(rooms) => {
    console.log('total rooms : ',rooms.length)
    for (let i = 0; i < rooms.length; i++) {
      if (rooms[i].startingTime < Date.now() && rooms[i].endingTime > Date.now()) {
        if (rooms[i].timestamp! - Date.now() >= 25000 || Date.now() - rooms[i].timestamp! >= 25000) {
          const nextIndex = rooms[i].activeBidderIndex! < rooms[i].participants.length - 1?rooms[i].activeBidderIndex! + 1 : 0;
          const nextParticipant = rooms[i].participants[nextIndex].userId;
          rooms[i].activeBidderIndex = nextIndex;
          rooms[i].activeBidder = nextParticipant;
          rooms[i].timestamp = Date.now()
          await rooms[i].save()
          console.log("next user index : ",nextIndex)
        }
      }

    }
  })

  setTimeout(() => {
    ListenAuctions()
  }, 5000);
}