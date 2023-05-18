import { Router } from 'express'
import { Bid, CreateRoom, GetActiveBidder, GetRoom, JoinPrivateRoom, JoinPublicRoom } from '../middlewares/rooms'

const router = Router()


router.post("/",CreateRoom)
router.post("/bid/:roomId",Bid)
router.get("/private/:userId",JoinPrivateRoom)
router.get("/public/:userId",JoinPublicRoom)
router.get("/:roomId",GetRoom)
router.get("/bidder/:roomId",GetActiveBidder)




export default router