import { Router } from 'express'
import { Bid, CreateRoom, GetActiveBidder, GetRoom, GetRooms, JoinPrivateRoom, JoinPublicRoom, Skip } from '../middlewares/rooms'

const router = Router()


router.post("/",CreateRoom)
router.post("/bid/:roomId",Bid)
router.post("/skip/:roomId",Skip)
router.get("/private/:userId",JoinPrivateRoom)
router.get("/",GetRooms)
router.get("/public/:userId",JoinPublicRoom)
router.get("/:roomId",GetRoom)
router.get("/bidder/:roomId",GetActiveBidder)




export default router